import db from '../db/connection';

export const fetchDailyCost = (country: string) => {
	const sqlText = `SELECT * FROM dailycost WHERE country = $1`;
	const values = [country];

	return db.query(sqlText, values).then(({ rows }) => {
		return rows[0];
	});
};
