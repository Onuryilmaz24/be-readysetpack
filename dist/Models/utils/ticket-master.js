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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = __importDefault(require("./utils"));
dotenv_1.default.config({ path: '.env.ticketmaster' });
const apikey = process.env.TICKET_MASTER_API_KEY;
function fetchEvents(start_date, end_date, city) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const startDate = (0, utils_1.default)(start_date);
        const endDate = (0, utils_1.default)(end_date);
        try {
            const response = yield axios_1.default.get(`https://app.ticketmaster.com/discovery/v2/events.json`, {
                params: {
                    apikey: apikey,
                    locale: '*',
                    startDateTime: startDate,
                    endDateTime: endDate,
                    city: city,
                },
            });
            if (!response.data._embedded || !response.data._embedded.events) {
                console.warn('No events found.');
                return [];
            }
            const events = response.data._embedded.events.map((event) => {
                var _a, _b, _c, _d, _e;
                return ({
                    name: event.name,
                    event_url: event.url,
                    img_url: ((_b = (_a = event.images) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url) || null,
                    date: event.dates.start.dateTime,
                    venue: ((_e = (_d = (_c = event._embedded) === null || _c === void 0 ? void 0 : _c.venues) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.name) || 'Unknown Venue',
                });
            });
            const shuffled = events.sort(() => { 0.5 - Math.random(); });
            return shuffled.slice(0, 5);
        }
        catch (err) {
            console.error('Ticketmaster API Error:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            return [];
        }
    });
}
exports.default = fetchEvents;
