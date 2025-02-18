import axios from 'axios';
import { Weather } from '../../types/types';

async function getMonthlyWeather(city: string, start_date: string, end_date: string): Promise<Weather> {
    try {
        // First get coordinates for the city
        const geoResponse = await axios.get(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        if (!geoResponse.data.results?.[0]) {
            throw new Error('City not found');
        }

        const { latitude, longitude } = geoResponse.data.results[0];

        // Convert future dates to last year's dates for historical data
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        const historicalStartDate = `${startDate.getFullYear()-1}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
        const historicalEndDate = `${endDate.getFullYear()-1}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

        // Get historical weather data
        const weatherResponse = await axios.get(
            `https://archive-api.open-meteo.com/v1/archive?` + 
            `latitude=${latitude}&longitude=${longitude}` +
            `&start_date=${historicalStartDate}&end_date=${historicalEndDate}` +
            `&daily=temperature_2m_mean,weathercode&timezone=auto`
        );

        if (!weatherResponse.data.daily?.temperature_2m_mean) {
            throw new Error('No weather data available');
        }

        const avgTemp = Math.round(
            weatherResponse.data.daily.temperature_2m_mean.reduce((a: number, b: number) => a + b, 0) / 
            weatherResponse.data.daily.temperature_2m_mean.length
        );

        const weatherCodes = weatherResponse.data.daily.weathercode;
        const dominantWeatherCode = getMostFrequentValue(weatherCodes);
        
        return {
            temp: avgTemp || 20, // Fallback temperature if calculation fails
            weather_type: getWeatherType(dominantWeatherCode)
        };

    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Fallback values for summer months (6-8)
        const month = new Date(start_date).getMonth() + 1;
        if (month >= 6 && month <= 8) {
            return { temp: 25, weather_type: "Warm and Sunny" };
        }
        // Default fallback
        return { temp: 15, weather_type: "Mild" };
    }
}

function getMostFrequentValue(arr: number[]): number {
    return arr.sort((a,b) =>
        arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop()!;
}

function getWeatherType(code: number): string {
    // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
    if (code === 0) return "Clear Sky";
    if (code === 1) return "Mainly Clear";
    if (code === 2) return "Partly Cloudy";
    if (code === 3) return "Overcast";
    if (code >= 51 && code <= 55) return "Drizzle";
    if (code >= 61 && code <= 65) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain Showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Mixed Weather";
}

export default getMonthlyWeather; 