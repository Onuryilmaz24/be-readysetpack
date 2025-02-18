import db from '../db/connection';
import { ChecklistItem } from '../types/types';
export const fetchSingleChecklist = (user_id: string, trip_id: string) => {
	const sqlText: string = `SELECT * FROM checklist WHERE user_id = $1 AND trip_id = $2;`;
	const values: string[] = [user_id, trip_id];

	return db.query(sqlText, values).then(({ rows }) => {
		return rows[0];
	});
};

export const addChecklist = (user_id: string, trip_id: string) => {
	const sqlText: string = `INSERT INTO checklist(user_id,trip_id,items) VALUES($1,$2,$3) RETURNING*;`;

	const items: ChecklistItem[] = [
		{
			item: 'Check your passport',
			completed: false,
		},
		{
			item: 'Print or download your tickets (flight/train/bus).',
			completed: false,
		},
		{
			item: 'Pack comfortable T-shirts/tops.',
			completed: false,
		},
		{
			item: 'Bring your phone charger.',
			completed: false,
		},
		{
			item: 'Pack a power bank for emergencies.',
			completed: false,
		},
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
	const newItem: ChecklistItem = {
		item: postBody,
		completed: false
	};

	const sqlText = `
        UPDATE checklist
        SET items = items || $1::jsonb
        WHERE user_id = $2 AND trip_id = $3
        RETURNING *;
    `;

	const values = [JSON.stringify([newItem]), user_id, trip_id];

	return db.query(sqlText, values).then(({ rows }) => {
		return rows[0];
	});
};

export const removeSingleItemFromItemsArray = (
	user_id: string,
	trip_id: string,
	deleteBody: string
) => {
	const itemToDelete: ChecklistItem = {
		item: deleteBody,
		completed: false
	};

	const sqlText: string = `
    UPDATE checklist
    SET items = (
        SELECT jsonb_agg(elem)
        FROM jsonb_array_elements(items) AS elem
        WHERE elem->>'item' <> $1
    )
    WHERE user_id = $2 AND trip_id = $3
    RETURNING *;
    `;

	const values = [itemToDelete.item, user_id, trip_id];

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
