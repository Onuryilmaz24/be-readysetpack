import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.currencyexchange' });

const apiKey = process.env.EXCHANGE_RATE_API_KEY;

async function fetchExchangeRate(
	currCurrency: string,
	targetCurrency: string,
	amount: number
) {
	const currencyApi = axios.create({
		baseURL: `https://v6.exchangerate-api.com/v6/${apiKey}/pair`,
	});

	return currencyApi
		.get(`/${currCurrency}/${targetCurrency}/${amount}`)
		.then(({ data }) => data.conversion_result);
}

export default fetchExchangeRate;
