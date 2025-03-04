"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEntireChecklist = exports.changeItemStatus = exports.removeSingleItemFromItemsArray = exports.addItemsToChecklist = exports.addChecklist = exports.fetchSingleChecklist = void 0;
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
        {
            item: "Check your passport",
            completed: false,
        },
        {
            item: "Print or download your tickets (flight/train/bus).",
            completed: false,
        },
        {
            item: "Pack comfortable T-shirts/tops.",
            completed: false,
        },
        {
            item: "Bring your phone charger.",
            completed: false,
        },
        {
            item: "Pack a power bank for emergencies.",
            completed: false,
        },
    ];
    const values = [user_id, trip_id, JSON.stringify(items)];
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.addChecklist = addChecklist;
const addItemsToChecklist = (user_id, trip_id, postBody) => {
    const newItem = {
        item: postBody,
        completed: false,
    };
    const sqlText = `
        UPDATE checklist
        SET items = items || $1::jsonb
        WHERE user_id = $2 AND trip_id = $3
        RETURNING *;
    `;
    const values = [JSON.stringify([newItem]), user_id, trip_id];
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.addItemsToChecklist = addItemsToChecklist;
const removeSingleItemFromItemsArray = (user_id, trip_id, deleteBody) => {
    const itemToDelete = {
        item: deleteBody,
        completed: false,
    };
    const sqlText = `
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
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.removeSingleItemFromItemsArray = removeSingleItemFromItemsArray;
const changeItemStatus = (user_id, trip_id, postBody) => {
    const sqlText = `
    UPDATE checklist
    SET items = (
      SELECT jsonb_agg(
        CASE 
          WHEN item->>'item' = $1 THEN
            jsonb_set(item, '{completed}', 
              CASE 
                WHEN item->>'completed' = 'true' THEN 'false'::jsonb
                ELSE 'true'::jsonb
              END)
          ELSE item
        END
      )
      FROM jsonb_array_elements(items) AS item
    )
    WHERE user_id = $2 AND trip_id = $3
    RETURNING *;
  `;
    const values = [postBody, user_id, trip_id];
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.changeItemStatus = changeItemStatus;
const deleteEntireChecklist = (user_id, trip_id) => {
    const values = [user_id, trip_id];
    const sqlText = `DELETE FROM checklist WHERE user_id = $1 AND trip_id = $2`;
    return connection_1.default.query(sqlText, values).then(({ rowCount }) => {
        return rowCount;
    });
};
exports.deleteEntireChecklist = deleteEntireChecklist;
