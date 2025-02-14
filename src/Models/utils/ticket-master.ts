import axios from 'axios';
import dotenv from 'dotenv';
import formatDate  from './utils';

dotenv.config({ path: '.env.ticketmaster' });

const apikey = process.env.TICKET_MASTER_API_KEY;

async function fetchEvents(start_date: string, end_date: string, city: string) {
    const startDate = formatDate(start_date);
    const endDate = formatDate(end_date);
    try {
        const response: any = await axios.get(
            `https://app.ticketmaster.com/discovery/v2/events.json`,
            {
                params: {
                    apikey: apikey,
                    locale: '*',
                    startDateTime: startDate,
                    endDateTime: endDate,
                    city: city, 
                },
            }
        );

        if (!response.data._embedded || !response.data._embedded.events) {
            console.warn('No events found.');
            return [];
        }

        const events= response.data._embedded.events.map((event: any) => ({
            name: event.name,
            event_url: event.url,
            img_url: event.images?.[0]?.url || null,
            date: event.dates.start.dateTime,
            venue: event._embedded?.venues?.[0]?.name || 'Unknown Venue',
        }));

        const shuffled = events.sort(()=>{0.5-Math.random()})

        return shuffled.slice(0,5)

    } catch (err: any) {
        console.error('Ticketmaster API Error:', err.response?.data || err.message);
        return [];
    }
}

export default fetchEvents