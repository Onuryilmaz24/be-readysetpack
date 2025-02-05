"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyCost = void 0;
const dailycostmodel_1 = require("../Models/dailycostmodel");
const api_utils_1 = require("../Models/api.utils");
const getDailyCost = (req, res, next) => {
    const country = req.params.country;
    const promises = [
        (0, dailycostmodel_1.fetchDailyCost)(country),
    ];
    if (country) {
        promises.push((0, api_utils_1.checkExist)("dailycost", "country", country));
    }
    Promise.all(promises)
        .then(([countryInfo]) => {
        res.status(200).send({ countryInfo });
    })
        .catch((err) => {
        next(err);
    });
};
exports.getDailyCost = getDailyCost;
