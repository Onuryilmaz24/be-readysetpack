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
const axios_1 = __importDefault(require("axios"));
function getMonthlyWeather(city, start_date, end_date) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const geoResponse = yield axios_1.default.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
            if (!((_a = geoResponse.data.results) === null || _a === void 0 ? void 0 : _a[0])) {
                throw new Error('City not found');
            }
            const { latitude, longitude } = geoResponse.data.results[0];
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            const historicalStartDate = `${startDate.getFullYear() - 1}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
            const historicalEndDate = `${endDate.getFullYear() - 1}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
            const weatherResponse = yield axios_1.default.get(`https://archive-api.open-meteo.com/v1/archive?` +
                `latitude=${latitude}&longitude=${longitude}` +
                `&start_date=${historicalStartDate}&end_date=${historicalEndDate}` +
                `&daily=temperature_2m_mean,weathercode&timezone=auto`);
            if (!((_b = weatherResponse.data.daily) === null || _b === void 0 ? void 0 : _b.temperature_2m_mean)) {
                throw new Error('No weather data available');
            }
            const avgTemp = Math.round(weatherResponse.data.daily.temperature_2m_mean.reduce((a, b) => a + b, 0) /
                weatherResponse.data.daily.temperature_2m_mean.length);
            const weatherCodes = weatherResponse.data.daily.weathercode;
            const dominantWeatherCode = getMostFrequentValue(weatherCodes);
            return {
                temp: avgTemp || 20,
                weather_type: getWeatherType(dominantWeatherCode)
            };
        }
        catch (error) {
            console.error('Error fetching weather data:', error);
            const month = new Date(start_date).getMonth() + 1;
            if (month >= 6 && month <= 8) {
                return { temp: 25, weather_type: "Warm and Sunny" };
            }
            return { temp: 15, weather_type: "Mild" };
        }
    });
}
function getMostFrequentValue(arr) {
    return arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop();
}
function getWeatherType(code) {
    if (code === 0)
        return "Clear Sky";
    if (code === 1)
        return "Mainly Clear";
    if (code === 2)
        return "Partly Cloudy";
    if (code === 3)
        return "Overcast";
    if (code >= 51 && code <= 55)
        return "Drizzle";
    if (code >= 61 && code <= 65)
        return "Rain";
    if (code >= 71 && code <= 77)
        return "Snow";
    if (code >= 80 && code <= 82)
        return "Rain Showers";
    if (code >= 95 && code <= 99)
        return "Thunderstorm";
    return "Mixed Weather";
}
exports.default = getMonthlyWeather;
