import db from '../connection';
import format from 'pg-format';
import {
	Users,
	Trips,
	Checklist,
	DailyExpectedCost,
	Destination,
	Weather,
	Budget,
	Landmark,
	Events,
} from '../../types/types';

const seed = ({
	usersData,
	tripsData,
	costsData,
	checklistData,
}: {
	usersData: Users[];
	tripsData: Trips[];
	costsData: DailyExpectedCost[];
	checklistData: Checklist[];
}) => {
	return db
		.query(`DROP TABLE IF EXISTS checklist`)
		.then(() => {
			return db.query('DROP TABLE IF EXISTS trips');
		})
		.then(() => {
			return db.query('DROP TABLE IF EXISTS users');
		})
		.then(() => {
			return db.query('DROP TABLE IF EXISTS dailycost');
		})
		.then(() => {
			const usersTablePromise = db.query(`
				CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
                CREATE TABLE users (
                    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    username VARCHAR NOT NULL,
                    name VARCHAR NOT NULL
                );`);
			const dailyCostTablePromise = db.query(`
                    CREATE TABLE dailycost (
                        country VARCHAR NOT NULL,
                        daily_cost_in_dollars INT NOT NULL
                    )`);
			return Promise.all([usersTablePromise, dailyCostTablePromise]);
		})
		.then(() => {
			return db.query(`
              CREATE TABLE trips (
               	trip_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
                destination JSONB,
                start_date VARCHAR NOT NULL,
                end_date VARCHAR NOT NULL,
                passport_issued_country VARCHAR NOT NULL,
                weather JSONB,
                visa_type VARCHAR,
                budget JSONB,
                is_booked_hotel BOOLEAN,
                people_count INT NOT NULL,
                city_information VARCHAR,
                landmarks JSONB,
                events JSONB,
                daily_expected_cost INT NOT NULL
              );  
                `);
		})
		.then(() => {
			return db.query(`
                CREATE TABLE checklist (
                    checklist_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    trip_id UUID REFERENCES trips(trip_id) ON DELETE CASCADE NOT NULL,
                    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
                    items JSONB
                );  
                `);
		})
		.then(() => {
			const userValues = usersData.map(({ username, name }) => [
				username,
				name,
			]);
			const insertUsersQueryStr = format(
				`
                INSERT INTO users(username, name)
                VALUES %L
				RETURNING *;
                `,
				userValues
			);
			const userPromise = db.query(insertUsersQueryStr).then(result =>{
				return result
			});

			const costValues = costsData.map(({ country, daily_cost_in_dollars }) => [
				country,
				daily_cost_in_dollars,
			]);
			const insertDailyCostQueryStr = format(
				`
                    INSERT INTO dailycost(country, daily_cost_in_dollars)
                    Values %L;
                `,
				costValues
			);
			const costPromise = db.query(insertDailyCostQueryStr);

			return Promise.all([userPromise, costPromise]);
		})
		.then(([userResult]) => {
			const users = userResult.rows
			const usernameToUserId = users.reduce((acc, { username, user_id }) => {
				acc[username] = user_id;
				return acc;
			}, {});

			const tripValues = tripsData.map(
				({
					username,
					destination,
					start_date,
					end_date,
					passport_issued_country,
					weather,
					visa_type,
					budget,
					is_booked_hotel,
					people_count,
					city_information,
					landmarks,
					events,
					daily_expected_cost,
				}) => [
					usernameToUserId[username],
					JSON.stringify(destination),
					start_date,
					end_date,
					passport_issued_country,
					JSON.stringify(weather),
					visa_type,
					JSON.stringify(budget),
					is_booked_hotel,
					people_count,
					city_information,
					JSON.stringify(landmarks),
					JSON.stringify(events),
					daily_expected_cost,
				]
			);
			const insertTripsQueryStr = format(
				`
                INSERT INTO trips (user_id,
					destination,
					start_date,
					end_date,
					passport_issued_country,
					weather,
					visa_type,
					budget,
					is_booked_hotel,
					people_count,
					city_information,
					landmarks,
					events,
					daily_expected_cost)
                    VALUES %L
					RETURNING *;
                `,
				tripValues
			);

			return db.query(insertTripsQueryStr).then(({rows:trips})=>{
				return {trips,usernameToUserId}
			});
		})
		.then(({ trips,usernameToUserId }) => {
			const tripToUsername: Record<string, string> = trips.reduce((acc, { trip_id, user_id }) => {
				if (trip_id && user_id) { 
					acc[trip_id] = user_id;
				}
				return acc;
			}, {});
		
			const checklistValues = checklistData.map(({ username, items }) => {
				const user_id = usernameToUserId[username];
				const trip_id = Object.keys(tripToUsername).find(
					(key) => tripToUsername[key] === user_id
				);
		
				if (!trip_id) {
					console.warn(`Missing trip_id for username: ${username}`);
					return null;
				}
		
				return [trip_id, user_id, JSON.stringify(items)];
			}).filter(Boolean); 
		
			if (checklistValues.length === 0) {
				console.warn("No valid checklist entries found. Skipping insert.");
				return;
			}
		
			const insertChecklistQueryStr = format(
				`INSERT INTO checklist (trip_id, user_id, items) VALUES %L;`,
				checklistValues
			);
		
			return db.query(insertChecklistQueryStr);
		})
};

export default seed;
