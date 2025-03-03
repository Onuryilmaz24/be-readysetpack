"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleTrip = exports.fetchSingleTrip = exports.changeTripData = exports.createTrip = exports.fetchTripsByUserId = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const fetch_city_info_1 = __importDefault(require("./utils/fetch-city-info"));
const convert_currency_1 = __importDefault(require("./utils/convert_currency"));
const visaCheck_1 = __importDefault(require("./utils/visaCheck"));
const ticket_master_1 = __importDefault(require("./utils/ticket-master"));
const google_places_1 = __importDefault(require("./utils/google-places"));
const weather_service_1 = __importDefault(require("./utils/weather-service"));
const fetchTripsByUserId = (user_id, sort_by = 'created_at', order = 'DESC') => {
    let sqlText = `SELECT * FROM trips WHERE user_id = $1 ORDER BY ${sort_by} ${order};`;
    const values = [user_id];
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows;
    });
};
exports.fetchTripsByUserId = fetchTripsByUserId;
const createTrip = (user_id, postBody) => __awaiter(void 0, void 0, void 0, function* () {
    const sqlText = `
	  INSERT INTO trips(user_id, destination, start_date, end_date, passport_issued_country, weather, visa_type, budget, is_booked_hotel, people_count, city_information, landmarks, events, daily_expected_cost)
	  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING*;
	`;
    const { destination, start_date, end_date, passport_issued_country, budget, is_booked_hotel, people_count, daily_expected_cost, } = postBody;
    const cityInfo = yield (0, fetch_city_info_1.default)(destination.city);
    const visa_type = yield (0, visaCheck_1.default)(destination.country, passport_issued_country);
    const events = yield (0, ticket_master_1.default)(start_date, end_date, destination.city);
    const landmarks = yield (0, google_places_1.default)(destination.city);
    const predictedWeather = yield (0, weather_service_1.default)(destination.city, start_date, end_date);
    const destination_amount = yield (0, convert_currency_1.default)(budget.current_currency, budget.destination_currency, budget.current_amount);
    const values = [
        user_id,
        JSON.stringify(destination),
        start_date,
        end_date,
        passport_issued_country,
        JSON.stringify(predictedWeather),
        visa_type,
        JSON.stringify(Object.assign(Object.assign({}, budget), { destination_amount: destination_amount })),
        is_booked_hotel,
        people_count,
        cityInfo,
        JSON.stringify(landmarks),
        JSON.stringify(events),
        daily_expected_cost,
    ];
    try {
        const { rows } = yield connection_1.default.query(sqlText, values);
        return rows[0];
    }
    catch (error) { }
});
exports.createTrip = createTrip;
const changeTripData = (user_id, trip_id, postBody) => {
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
    values.push(trip_id, user_id);
    const sqlText = `UPDATE trips SET ${setClause} 
  WHERE trip_id = $${values.length - 1} 
  AND user_id = $${values.length} 
  RETURNING *;`;
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.changeTripData = changeTripData;
const fetchSingleTrip = (user_id, trip_id) => {
    let sqlText = `SELECT * FROM trips WHERE user_id = $1 AND trip_id = $2;`;
    const values = [user_id, trip_id];
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.fetchSingleTrip = fetchSingleTrip;
const deleteSingleTrip = (user_id, trip_id) => {
    const sqlText = `DELETE FROM trips WHERE user_id = $1 AND trip_id = $2`;
    const values = [user_id, trip_id];
    return connection_1.default.query(sqlText, values).then(({ rowCount }) => {
        return rowCount;
    });
};
exports.deleteSingleTrip = deleteSingleTrip;
