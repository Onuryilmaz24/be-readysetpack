"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSingleTrip = exports.getSingleTrip = exports.updateTripData = exports.addTrip = exports.getTripsByUserId = void 0;
const api_utils_1 = require("../Models/api.utils");
const tripsmodels_1 = require("../Models/tripsmodels");
const getTripsByUserId = (req, res, next) => {
    const user_id = req.params.user_id;
    const promises = [(0, tripsmodels_1.fetchTripsByUserId)(user_id)];
    if (user_id) {
        promises.push((0, api_utils_1.checkExist)('users', 'user_id', user_id));
    }
    Promise.all(promises)
        .then(([trips]) => {
        res.status(200).send({ trips });
    })
        .catch((err) => {
        next(err);
    });
};
exports.getTripsByUserId = getTripsByUserId;
const addTrip = (req, res, next) => {
    const user_id = req.params.user_id;
    const postBody = req.body;
    const promises = [(0, tripsmodels_1.createTrip)(user_id, postBody)];
    if (user_id) {
        promises.push((0, api_utils_1.checkExist)('users', 'user_id', user_id));
    }
    Promise.all(promises)
        .then(([trip]) => {
        res.status(201).send({ trip });
    })
        .catch((err) => {
        next(err);
    });
};
exports.addTrip = addTrip;
const updateTripData = (req, res, next) => {
    const user_id = req.params.user_id;
    const trip_id = req.params.trip_id;
    const postBody = req.body;
    const promises = [
        (0, tripsmodels_1.changeTripData)(user_id, trip_id, postBody),
    ];
    if (user_id) {
        promises.push((0, api_utils_1.checkExist)('users', 'user_id', user_id));
    }
    if (trip_id) {
        promises.push((0, api_utils_1.checkExist)('trips', 'trip_id', trip_id));
    }
    Promise.all(promises)
        .then(([trip]) => {
        res.status(200).send({ trip });
    })
        .catch((err) => {
        next(err);
    });
};
exports.updateTripData = updateTripData;
const getSingleTrip = (req, res, next) => {
    const user_id = req.params.user_id;
    const trip_id = req.params.trip_id;
    const promises = [
        (0, tripsmodels_1.fetchSingleTrip)(user_id, trip_id),
    ];
    if (user_id) {
        promises.push((0, api_utils_1.checkExist)('users', 'user_id', user_id));
    }
    if (trip_id) {
        promises.push((0, api_utils_1.checkExist)('trips', 'trip_id', trip_id));
    }
    Promise.all(promises)
        .then(([trip]) => {
        res.status(200).send({ trip });
    })
        .catch((err) => {
        next(err);
    });
};
exports.getSingleTrip = getSingleTrip;
const removeSingleTrip = (req, res, next) => {
    const user_id = req.params.user_id;
    const trip_id = req.params.trip_id;
    const promises = [
        (0, tripsmodels_1.deleteSingleTrip)(user_id, trip_id),
    ];
    if (user_id) {
        promises.push((0, api_utils_1.checkExist)('users', 'user_id', user_id));
    }
    if (trip_id) {
        promises.push((0, api_utils_1.checkExist)('trips', 'trip_id', trip_id));
    }
    Promise.all(promises)
        .then(([removedRow]) => {
        res.status(204).send({ removedRow });
    })
        .catch((err) => {
        next(err);
    });
};
exports.removeSingleTrip = removeSingleTrip;
