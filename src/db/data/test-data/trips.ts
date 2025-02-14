import { Trips, Destination } from '../../../types/types';

const tripsData: Trips[] = [
	{
		username: "alex123" ,
		destination: {
			city: 'Paris',
			country: 'FR',
			currency: 'EUR',
		},
		start_date: '13/01/2025',
		end_date: '23/01/2025',
		passport_issued_country: 'UK',
		weather: {
			temp: 20,
			weather_type: 'Sunny',
		},
		visa_type: 'eVisa',
		budget: {
			current_amount: 2000,
			current_currency: 'EUR',
			destination_currency: 'TRY',
			destination_amount: 3000,
		},
		is_booked_hotel: true,
		people_count: 1,
		city_information: 'Capital of France',
		landmarks: {
			best_places_to_visit: ['Tower', 'City Center', 'Museum'],
			img_url_of_landmarks: ['', '', ''],
		},
		events: [
			{
				name: 'eminem concert',
				venue: 'empty venue',
				date: '15/01/2025',
				img_url: '',
				event_url: "",
			},
		],
		daily_expected_cost: 200,
	},
	{
		username: "matthew123",
		destination: {
			city: 'Berlin',
			country: 'DE',
			currency: 'EUR',
		},
		start_date: '13/01/2025',
		end_date: '23/01/2025',
		passport_issued_country: 'UK',
		weather: {
			temp: 10,
			weather_type: 'Cloudly',
		},
		visa_type: 'eVisa',
		budget: {
			current_amount: 2000,
			current_currency: 'EUR',
			destination_currency: 'TRY',
			destination_amount: 3000,
		},
		is_booked_hotel: false,
		people_count: 2,
		city_information: 'Capital of Germany',
		landmarks: {
			best_places_to_visit: ['Tower', 'City Center', 'Museum'],
			img_url_of_landmarks: ['', '', ''],
		},
		events: [
			{
				name: 'eminem concert',
				venue: 'empty venue',
				date: '15/01/2025',
				img_url: '',
				event_url: ""}
		],
		daily_expected_cost: 200,
	},
	{
		username: "onur123",
		destination: {
			city: 'Amsterdam',
			country: 'NL',
			currency: 'EUR',
		},
		start_date: '26/01/2025',
		end_date: '05/02/2025',
		passport_issued_country: 'UK',
		weather: {
			temp: 15,
			weather_type: 'Sunny',
		},
		visa_type: 'eVisa',
		budget: {
			current_amount: 2000,
			current_currency: 'EUR',
			destination_currency: 'TRY',
			destination_amount: 3000,
		},
		is_booked_hotel: true,
		people_count: 1,
		city_information: 'Capital of Netherlands',
		landmarks: {
			best_places_to_visit: ['Tower', 'City Center', 'Museum'],
			img_url_of_landmarks: ['', '', ''],
		},
		events: [
			{
				name: 'eminem concert',
				venue: 'empty venue',
				date: '15/01/2025',
				img_url: '',
				event_url: "",
			},
		],
		daily_expected_cost: 200,
	},
];

export default tripsData;
