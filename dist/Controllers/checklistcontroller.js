"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItemCompleted = exports.removeEntireChecklist = exports.deleteSingleItemFromItems = exports.updateChecklistItems = exports.postChecklist = exports.getSingleChecklist = void 0;
const api_utils_1 = require("../Models/api.utils");
const checklistmodel_1 = require("../Models/checklistmodel");
const getSingleChecklist = (req, res, next) => {
    const user_id = req.params.user_id;
    const trip_id = req.params.trip_id;
    const promises = [
        (0, checklistmodel_1.fetchSingleChecklist)(user_id, trip_id),
    ];
    if (user_id) {
        promises.push((0, api_utils_1.checkExist)("users", "user_id", user_id));
    }
    if (trip_id) {
        promises.push((0, api_utils_1.checkExist)("trips", "trip_id", trip_id));
    }
    Promise.all(promises)
        .then(([checklist]) => {
        res.status(200).send({ checklist });
    })
        .catch((err) => {
        next(err);
    });
};
exports.getSingleChecklist = getSingleChecklist;
const postChecklist = (req, res, next) => {
    const user_id = req.params.user_id;
    const trip_id = req.params.trip_id;
    const postBody = req.body;
    const promises = [
        (0, checklistmodel_1.addChecklist)(user_id, trip_id),
    ];
    if (user_id) {
        promises.push((0, api_utils_1.checkExist)("users", "user_id", user_id));
    }
    if (trip_id) {
        promises.push((0, api_utils_1.checkExist)("trips", "trip_id", trip_id));
    }
    Promise.all(promises)
        .then(([checklist]) => {
        res.status(201).send({ checklist });
    })
        .catch((err) => {
        next(err);
    });
};
exports.postChecklist = postChecklist;
const updateChecklistItems = (req, res, next) => {
    const user_id = req.params.user_id;
    const trip_id = req.params.trip_id;
    const postBody = req.body.newItem;
    const promises = [
        (0, checklistmodel_1.addItemsToChecklist)(user_id, trip_id, postBody),
    ];
    if (user_id) {
        promises.push((0, api_utils_1.checkExist)("users", "user_id", user_id));
    }
    if (trip_id) {
        promises.push((0, api_utils_1.checkExist)("trips", "trip_id", trip_id));
    }
    Promise.all(promises)
        .then(([checklist]) => {
        res.status(200).send({ checklist });
    })
        .catch((err) => {
        next(err);
    });
};
exports.updateChecklistItems = updateChecklistItems;
const deleteSingleItemFromItems = (req, res, next) => {
    const user_id = req.params.user_id;
    const trip_id = req.params.trip_id;
    const deleteBody = req.body.item;
    const promises = [
        (0, checklistmodel_1.removeSingleItemFromItemsArray)(user_id, trip_id, deleteBody),
    ];
    if (user_id) {
        promises.push((0, api_utils_1.checkExist)("users", "user_id", user_id));
    }
    if (trip_id) {
        promises.push((0, api_utils_1.checkExist)("trips", "trip_id", trip_id));
    }
    Promise.all(promises)
        .then(([checklist]) => {
        res.status(200).send({ checklist });
    })
        .catch((err) => {
        next(err);
    });
};
exports.deleteSingleItemFromItems = deleteSingleItemFromItems;
const removeEntireChecklist = (req, res, next) => {
    const user_id = req.params.user_id;
    const trip_id = req.params.trip_id;
    const promises = [
        (0, checklistmodel_1.deleteEntireChecklist)(user_id, trip_id),
    ];
    if (user_id) {
        promises.push((0, api_utils_1.checkExist)("users", "user_id", user_id));
    }
    if (trip_id) {
        promises.push((0, api_utils_1.checkExist)("trips", "trip_id", trip_id));
    }
    Promise.all(promises)
        .then(([removedRow]) => {
        res.status(204).send({ removedRow });
    })
        .catch((err) => {
        next(err);
    });
};
exports.removeEntireChecklist = removeEntireChecklist;
const updateItemCompleted = (req, res, next) => {
    const user_id = req.params.user_id;
    const trip_id = req.params.trip_id;
    const postBody = req.body.newItem;
    const promises = [
        (0, checklistmodel_1.changeItemStatus)(user_id, trip_id, postBody),
    ];
    if (user_id) {
        promises.push((0, api_utils_1.checkExist)("users", "user_id", user_id));
    }
    if (trip_id) {
        promises.push((0, api_utils_1.checkExist)("trips", "trip_id", trip_id));
    }
    Promise.all(promises)
        .then(([checklist]) => {
        res.status(200).send({ checklist });
    })
        .catch((err) => {
        next(err);
    });
};
exports.updateItemCompleted = updateItemCompleted;
