"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userscontroller_1 = require("../Controllers/userscontroller");
const usersRouter = express_1.default.Router();
usersRouter.get('/', userscontroller_1.getAllUsers);
usersRouter.get('/:user_id', userscontroller_1.getSingleUser);
usersRouter.delete('/:user_id', userscontroller_1.deleteUser);
usersRouter.post('/', userscontroller_1.postUser);
usersRouter.patch('/:user_id', userscontroller_1.changeUserInfo);
exports.default = usersRouter;
