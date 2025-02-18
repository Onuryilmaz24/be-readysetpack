"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config({ path: '.env.googleplaces' });
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
function fetchLandmarks(city) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=top+landmarks+in+${city}&type=tourist_attraction&key=${GOOGLE_API_KEY}`;
            const response = yield axios_1.default.get(searchUrl);
            const places = response.data.results.slice(0, 5);
            const landmarks = yield Promise.all(places.map((place) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,rating,formatted_address,editorial_summary&key=${GOOGLE_API_KEY}`;
                const detailsResponse = yield axios_1.default.get(detailsUrl);
                const details = detailsResponse.data.result;
                return {
                    name: place.name,
                    description: ((_a = details.editorial_summary) === null || _a === void 0 ? void 0 : _a.overview) ||
                        `Popular landmark in ${city} with ${place.rating} star rating.`,
                    img_url: ((_c = (_b = place.photos) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.photo_reference) ?
                        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` :
                        `https://source.unsplash.com/featured/?${encodeURIComponent(place.name)}`
                };
            })));
            return landmarks;
        }
        catch (error) {
            console.error('Error fetching landmarks:', error.message);
            console.error('Full error:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error);
            return [
                {
                    name: `${city} Historical Site`,
                    description: `Major historical site in ${city}`,
                    img_url: `https://source.unsplash.com/featured/?${encodeURIComponent(city)}+historical`
                },
                {
                    name: `${city} Museum`,
                    description: `Popular museum in ${city}`,
                    img_url: `https://source.unsplash.com/featured/?${encodeURIComponent(city)}+museum`
                },
                {
                    name: `${city} Park`,
                    description: `Central park in ${city}`,
                    img_url: `https://source.unsplash.com/featured/?${encodeURIComponent(city)}+park`
                }
            ];
        }
    });
}
exports.default = fetchLandmarks;
