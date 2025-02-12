"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEntireChecklist = exports.removeSingleItemFromItemsArray = exports.addItemsToChecklist = exports.addChecklist = exports.fetchSingleChecklist = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const fetchSingleChecklist = (user_id, trip_id) => {
    const sqlText = `SELECT * FROM checklist WHERE user_id = $1 AND trip_id = $2;`;
    const values = [user_id, trip_id];
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.fetchSingleChecklist = fetchSingleChecklist;
const addChecklist = (user_id, trip_id) => {
    const sqlText = `INSERT INTO checklist(user_id,trip_id,items) VALUES($1,$2,$3) RETURNING*;`;
    const items = [
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
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.addChecklist = addChecklist;
const addItemsToChecklist = (user_id, trip_id, postBody) => {
    const values = [postBody, user_id, trip_id];
    const sqlText = `
        UPDATE checklist
        SET items = items || to_jsonb($1::text)
        WHERE user_id = $2 AND trip_id = $3
        RETURNING *;
    `;
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.addItemsToChecklist = addItemsToChecklist;
const removeSingleItemFromItemsArray = (user_id, trip_id, deleteBody) => {
    const values = [deleteBody, user_id, trip_id];
    const sqlText = `
    UPDATE checklist
    SET items = (
        SELECT jsonb_agg(elem)
        FROM jsonb_array_elements(items) AS elem
        WHERE elem <> to_jsonb($1::text)
    )
    WHERE user_id = $2 AND trip_id = $3
    RETURNING *;
  `;
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.removeSingleItemFromItemsArray = removeSingleItemFromItemsArray;
const deleteEntireChecklist = (user_id, trip_id) => {
    const values = [user_id, trip_id];
    const sqlText = `DELETE FROM checklist WHERE user_id = $1 AND trip_id = $2`;
    return connection_1.default.query(sqlText, values).then(({ rowCount }) => {
        return rowCount;
    });
};
exports.deleteEntireChecklist = deleteEntireChecklist;
