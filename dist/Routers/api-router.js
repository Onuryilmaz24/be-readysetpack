"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const homecontroller_1 = __importDefault(require("../Controllers/homecontroller"));
const users_router_1 = __importDefault(require("./users-router"));
const daily_cost_router_1 = __importDefault(require("./daily-cost-router"));
const trips_router_1 = __importDefault(require("./trips-router"));
const checklist_router_1 = __importDefault(require("./checklist-router"));
const apiRouter = express_1.default.Router();
apiRouter.get('/', homecontroller_1.default);
apiRouter.use('/users', users_router_1.default);
apiRouter.use('/dailyCost', daily_cost_router_1.default);
apiRouter.use('/trips', trips_router_1.default);
apiRouter.use('/checklists', checklist_router_1.default);
exports.default = apiRouter;
