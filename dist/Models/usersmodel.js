"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.addUser = exports.removeUser = exports.fetchSingleUser = exports.fetchAllUsers = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const fetchAllUsers = () => {
    return connection_1.default.query('SELECT * FROM users;').then(({ rows }) => {
        return rows;
    });
};
exports.fetchAllUsers = fetchAllUsers;
const fetchSingleUser = (user_id) => {
    const sqlText = `SELECT * FROM users WHERE user_id = $1`;
    const values = [user_id];
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.fetchSingleUser = fetchSingleUser;
const removeUser = (user_id) => {
    const sqlText = `DELETE FROM users WHERE user_id = $1`;
    const values = [user_id];
    return connection_1.default.query(sqlText, values).then(({ rowCount }) => {
        return rowCount;
    });
};
exports.removeUser = removeUser;
const addUser = (postBody) => {
    const { username, name } = postBody;
    const validColumns = ['username', 'name'];
    if (!Object.keys(postBody).every((key) => validColumns.includes(key))) {
        return Promise.reject({ statusCode: 400, message: 'Bad Request' });
    }
    const nameRegex = /\d/i;
    if (nameRegex.test(name)) {
        return Promise.reject({ statusCode: 400, message: 'Bad Request' });
    }
    let sqlInsertQuery = `INSERT INTO users (username, name)
	VALUES ($1, $2) RETURNING *;`;
    const values = [username, name];
    return connection_1.default.query(sqlInsertQuery, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.addUser = addUser;
const updateUser = (user_id, postBody) => {
    const { name } = postBody;
    const values = Object.values(postBody);
    const updateFields = Object.keys(postBody);
    const validColumns = ['username', 'name'];
    if (!Object.keys(postBody).every((key) => validColumns.includes(key))) {
        return Promise.reject({ statusCode: 400, message: 'Bad Request' });
    }
    const nameRegex = /\d/i;
    if (nameRegex.test(name)) {
        return Promise.reject({ statusCode: 400, message: 'Bad Request' });
    }
    const setClause = updateFields
        .map((field, index) => {
        return `${field} = $${index + 1}`;
    })
        .join(`, `);
    values.push(user_id);
    const updateQuery = `
    UPDATE users
    SET ${setClause}
    WHERE user_id = $${values.length}
    RETURNING *;
  `;
    return connection_1.default.query(updateQuery, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.updateUser = updateUser;
