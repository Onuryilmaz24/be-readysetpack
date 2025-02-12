"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverErrorHandler = exports.postgresErrorHandler = exports.customErrorHandler = void 0;
class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
const customErrorHandler = (err, req, res, next) => {
    if (err.statusCode && err.message) {
        res.status(err.statusCode).send({ msg: err.message });
    }
    else {
        next(err);
    }
};
exports.customErrorHandler = customErrorHandler;
const postgresErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad Request' });
    }
    else if (err.code === '23503' ||
        err.code === '42703' ||
        err.code === '42601') {
        res.status(404).send({ msg: 'Does Not Found' });
    }
    else {
        next(err);
    }
};
exports.postgresErrorHandler = postgresErrorHandler;
const serverErrorHandler = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
};
exports.serverErrorHandler = serverErrorHandler;
