import axios from "axios";

const visaApi = axios.create({
    baseURL: "https://rough-sun-2523.fly.dev/"
});

async function visaCheck(
	destinationCountry:string,
    passportCountry:string
) {

	return visaApi
		.get(`/visa/${passportCountry}/${destinationCountry}`)
		.then(({ data }) => data.category.name);
}

export default visaCheck