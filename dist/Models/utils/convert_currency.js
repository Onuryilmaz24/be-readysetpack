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
dotenv_1.default.config({ path: '.env.currencyexchange' });
const apiKey = process.env.EXCHANGE_RATE_API_KEY;
function fetchExchangeRate(currCurrency, targetCurrency, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const currencyApi = axios_1.default.create({
            baseURL: `https://v6.exchangerate-api.com/v6/${apiKey}/pair`,
        });
        return currencyApi
            .get(`/${currCurrency}/${targetCurrency}/${amount}`)
            .then(({ data }) => data.conversion_result);
    });
}
exports.default = fetchExchangeRate;
