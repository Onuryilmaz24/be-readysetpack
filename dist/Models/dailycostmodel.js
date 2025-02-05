"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDailyCost = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const fetchDailyCost = (country) => {
    const sqlText = `SELECT * FROM dailycost WHERE country = $1`;
    const values = [country];
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.fetchDailyCost = fetchDailyCost;
