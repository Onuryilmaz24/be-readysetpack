"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("../data/test-data/users"));
const trips_1 = __importDefault(require("../data/test-data/trips"));
const checklist_1 = __importDefault(require("../data/test-data/checklist"));
const dailycost_1 = __importDefault(require("../data/test-data/dailycost"));
const seed_1 = __importDefault(require("./seed"));
const connection_1 = __importDefault(require("../connection"));
const runSeed = () => {
    return (0, seed_1.default)({ usersData: users_1.default, tripsData: trips_1.default, checklistData: checklist_1.default, costsData: dailycost_1.default }).then(() => connection_1.default.end());
};
runSeed();
