"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tripscontroller_1 = require("../Controllers/tripscontroller");
const tripsRouter = express_1.default.Router();
tripsRouter.get('/:user_id', tripscontroller_1.getTripsByUserId);
tripsRouter.post('/:user_id', tripscontroller_1.addTrip);
tripsRouter.patch('/:user_id/:trip_id', tripscontroller_1.updateTripData);
tripsRouter.get('/:user_id/:trip_id', tripscontroller_1.getSingleTrip);
tripsRouter.delete('/:user_id/:trip_id', tripscontroller_1.removeSingleTrip);
exports.default = tripsRouter;
