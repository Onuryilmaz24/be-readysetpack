"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dailycostcontroller_1 = require("../Controllers/dailycostcontroller");
const dailyCostRouter = express_1.default.Router();
dailyCostRouter.get('/:country', dailycostcontroller_1.getDailyCost);
exports.default = dailyCostRouter;
