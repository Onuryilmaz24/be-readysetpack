import db from '../db/connection';

export const fetchSingleChecklist = (user_id: string, trip_id: string) => {
	const sqlText: string = `SELECT * FROM checklist WHERE user_id = $1 AND trip_id = $2;`;
	const values: string[] = [user_id, trip_id];

	return db.query(sqlText, values).then(({ rows }) => {
		return rows[0];
	});
};

export const addChecklist = (user_id: string, trip_id: string) => {
	const sqlText: string = `INSERT INTO checklist(user_id,trip_id,items) VALUES($1,$2,$3) RETURNING*;`;

	const items: string[] = [
		'Check your passport',
		'Print or download your tickets (flight/train/bus).',
		'Pack comfortable T-shirts/tops.',
		'Dont forget your pants/shorts/skirts.',
		'Pack comfortable shoes for walking.',
		'Pack your toothbrush and toothpaste.',
		'Bring your phone charger.',
		'Pack a power bank for emergencies.',
	];

	const values = [user_id, trip_id, JSON.stringify(items)];

	return db.query(sqlText, values).then(({ rows }) => {
		return rows[0];
	});
};

export const addItemsToChecklist = (
	user_id: string,
	trip_id: string,
	postBody: string
) => {
	const values = [postBody, user_id, trip_id];

	const sqlText = `
        UPDATE checklist
        SET items = items || to_jsonb($1::text)
        WHERE user_id = $2 AND trip_id = $3
        RETURNING *;
    `;

	return db.query(sqlText, values).then(({ rows }) => {
		return rows[0];
	});
};

export const removeSingleItemFromItemsArray = (
	user_id: string,
	trip_id: string,
	deleteBody: string
) => {
	const values = [deleteBody, user_id, trip_id];

	const sqlText: string = `
    UPDATE checklist
    SET items = (
        SELECT jsonb_agg(elem)
        FROM jsonb_array_elements(items) AS elem
        WHERE elem <> to_jsonb($1::text)
    )
    WHERE user_id = $2 AND trip_id = $3
    RETURNING *;
  `;

	return db.query(sqlText, values).then(({ rows }) => {
		return rows[0];
	});
};

export const deleteEntireChecklist = (user_id: string, trip_id: string) => {
	const values = [user_id, trip_id];
	const sqlText: string = `DELETE FROM checklist WHERE user_id = $1 AND trip_id = $2`;

	return db.query(sqlText, values).then(({ rowCount }) => {
		return rowCount;
	});
};
