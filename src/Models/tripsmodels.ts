import db from '../db/connection';
import fetchCityInfo from './utils/fetch-city-info';
import { Trips } from '../types/types';
import fetchExchangeRate from './utils/convert_currency';

export const fetchTripsByUserId = (
	user_id: number,
	sort_by: string = 'trip_id',
	order: string = 'DESC'
) => {
	let sqlText: string = `SELECT * FROM trips WHERE user_id = $1 ORDER BY ${sort_by} ${order};`;
	const values: number[] = [user_id];

	return db.query(sqlText, values).then(({ rows }) => {
		return rows;
	});
};

export const createTrip = async (user_id: number, postBody: Trips) => {
	const sqlText: string = `
	  INSERT INTO trips(user_id, destination, start_date, end_date, passport_issued_country, weather, visa_type, budget, is_booked_hotel, people_count, city_information, landmarks, events, daily_expected_cost)
	  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING*;
	`;

	const {
		destination,
		start_date,
		end_date,
		passport_issued_country,
		weather,
		visa_type,
		budget,
		is_booked_hotel,
		people_count,
		landmarks,
		events,
		daily_expected_cost,
	} = postBody;

	/* const cityInfo = await fetchCityInfo(destination.city); */

	let cityInfo:string = "Hello From Here"

/* 	const destination_amount = await fetchExchangeRate(
		budget.current_currency,
		budget.destination_currency,
		budget.current_amount
	); */

	const values = [
		user_id,
		JSON.stringify(destination),
		start_date,
		end_date,
		passport_issued_country,
		JSON.stringify(weather),
		visa_type,
		JSON.stringify({ ...budget, destination_amount: 150 }),
		is_booked_hotel,
		people_count,
		cityInfo,
		JSON.stringify(landmarks),
		JSON.stringify(events),
		daily_expected_cost,
	];

	try {
		const { rows } = await db.query(sqlText, values);
		return rows[0];
	} catch (error) {}
};

export const changeTripData = (
	user_id: number,
	trip_id: number,
	postBody: any
) => {
	const values = Object.values(postBody);
	const updateFields = Object.keys(postBody);
	const validColumns = [
		'start_date',
		'end_date',
		'budget',
		'is_booked_hotel',
		'people_count',
	];

	if (!Object.keys(postBody).every((key) => validColumns.includes(key))) {
		return Promise.reject({ statusCode: 400, message: 'Bad Request' });
	}

	const setClause = updateFields
		.map((field, index) => {
			return `${field} = $${index + 1}`;
		})
		.join(', ');

	values.push(Number(trip_id), Number(user_id));

	const sqlText = `UPDATE trips SET ${setClause} 
  WHERE trip_id = $${values.length - 1} 
  AND user_id = $${values.length} 
  RETURNING *;`;

	return db.query(sqlText, values).then(({ rows }) => {
		return rows[0];
	});
};

export const fetchSingleTrip = (user_id: number, trip_id: number) => {
	let sqlText: string = `SELECT * FROM trips WHERE user_id = $1 AND trip_id = $2;`;
	const values: number[] = [user_id, trip_id];

	return db.query(sqlText, values).then(({ rows }) => {
		return rows[0];
	});
};

export const deleteSingleTrip = (user_id: number, trip_id: number) => {
	const sqlText: string = `DELETE FROM trips WHERE user_id = $1 AND trip_id = $2`;
	const values = [user_id, trip_id];

	return db.query(sqlText, values).then(({ rowCount }) => {
		return rowCount;
	});
};
