"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserInfo = exports.postUser = exports.deleteUser = exports.getSingleUser = exports.getAllUsers = void 0;
const usersmodel_1 = require("../Models/usersmodel");
const api_utils_1 = require("../Models/api.utils");
const getAllUsers = (req, res, next) => {
    (0, usersmodel_1.fetchAllUsers)()
        .then((users) => {
        res.status(200).send({ users });
    })
        .catch((err) => {
        next(err);
    });
};
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res, next) => {
    const user_id = req.params.user_id;
    const promises = [(0, usersmodel_1.fetchSingleUser)(user_id)];
    if (user_id) {
        promises.push((0, api_utils_1.checkExist)('users', 'user_id', user_id));
    }
    Promise.all(promises)
        .then(([user]) => {
        res.status(200).send({ user });
    })
        .catch((err) => {
        next(err);
    });
};
exports.getSingleUser = getSingleUser;
const deleteUser = (req, res, next) => {
    const user_id = req.params.user_id;
    const promises = [(0, usersmodel_1.removeUser)(user_id)];
    if (user_id) {
        promises.push((0, api_utils_1.checkExist)('users', 'user_id', user_id));
    }
    Promise.all(promises)
        .then(([removedRow]) => {
        res.status(204).send({ removedRow });
    })
        .catch((err) => {
        next(err);
    });
};
exports.deleteUser = deleteUser;
const postUser = (req, res, next) => {
    const postBody = req.body;
    (0, usersmodel_1.addUser)(postBody)
        .then((user) => {
        res.status(201).send({ user });
    })
        .catch((err) => {
        next(err);
    });
};
exports.postUser = postUser;
const changeUserInfo = (req, res, next) => {
    const postBody = req.body;
    const user_id = req.params.user_id;
    const promises = [(0, usersmodel_1.updateUser)(user_id, postBody)];
    if (user_id) {
        promises.push((0, api_utils_1.checkExist)('users', 'user_id', user_id));
    }
    Promise.all(promises)
        .then(([user]) => {
        res.status(200).send({ user });
    })
        .catch((err) => {
        next(err);
    });
};
exports.changeUserInfo = changeUserInfo;
