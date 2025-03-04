"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checklistcontroller_1 = require("../Controllers/checklistcontroller");
const checklistRouter = express_1.default.Router();
checklistRouter.get("/:user_id/:trip_id", checklistcontroller_1.getSingleChecklist);
checklistRouter.post("/:user_id/:trip_id", checklistcontroller_1.postChecklist);
checklistRouter.patch("/:user_id/:trip_id", checklistcontroller_1.updateChecklistItems);
checklistRouter.patch("/:user_id/:trip_id/delete-item", checklistcontroller_1.deleteSingleItemFromItems);
checklistRouter.patch("/:user_id/:trip_id/change-status", checklistcontroller_1.updateItemCompleted);
checklistRouter.delete("/:user_id/:trip_id", checklistcontroller_1.removeEntireChecklist);
exports.default = checklistRouter;
