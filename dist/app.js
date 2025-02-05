"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const api_router_1 = __importDefault(require("./Routers/api-router"));
const error_1 = require("./error");
const app = (0, express_1.default)();
app.use(express_1.default.json(), (0, cors_1.default)());
app.use('/api', api_router_1.default);
app.use(error_1.customErrorHandler);
app.use(error_1.postgresErrorHandler);
app.use(error_1.serverErrorHandler);
exports.default = app;
