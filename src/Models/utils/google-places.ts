import dotenv from 'dotenv';
import axios from 'axios';
import { Landmark } from '../../types/types';

dotenv.config({ path: '.env.googleplaces' });

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

async function fetchLandmarks(city: string): Promise<Landmark[]> {
    try {
        // First get landmarks in the city
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=top+landmarks+in+${city}&type=tourist_attraction&key=${GOOGLE_API_KEY}`;
        
        const response = await axios.get(searchUrl);
        const places = response.data.results.slice(0, 5);

        // Get details for each place to get better descriptions
        const landmarks = await Promise.all(places.map(async (place: any) => {
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,rating,formatted_address,editorial_summary&key=${GOOGLE_API_KEY}`;
            const detailsResponse = await axios.get(detailsUrl);
            const details = detailsResponse.data.result;

            return {
                name: place.name,
                // Use editorial summary if available, otherwise use a formatted string
                description: details.editorial_summary?.overview || 
                           `Popular landmark in ${city} with ${place.rating} star rating.`,
                img_url: place.photos?.[0]?.photo_reference ? 
                    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` :
                    `https://source.unsplash.com/featured/?${encodeURIComponent(place.name)}`
            };
        }));

        return landmarks;
    } catch (error: any) {
        console.error('Error fetching landmarks:', error.message);
        console.error('Full error:', error.response?.data || error);
        
        // Return fallback data instead of throwing
        return [
            {
                name: `${city} Historical Site`,
                description: `Major historical site in ${city}`,
                img_url: `https://source.unsplash.com/featured/?${encodeURIComponent(city)}+historical`
            },
            {
                name: `${city} Museum`,
                description: `Popular museum in ${city}`,
                img_url: `https://source.unsplash.com/featured/?${encodeURIComponent(city)}+museum`
            },
            {
                name: `${city} Park`,
                description: `Central park in ${city}`,
                img_url: `https://source.unsplash.com/featured/?${encodeURIComponent(city)}+park`
            }
        ];
    }
}

export default fetchLandmarks; 