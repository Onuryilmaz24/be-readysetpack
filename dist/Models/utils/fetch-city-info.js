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
Object.defineProperty(exports, "__esModule", { value: true });
function fetchCityInfo(city_1) {
    return __awaiter(this, arguments, void 0, function* (city, maxLength = 500) {
        var _a;
        const endpoint = 'https://en.wikipedia.org/w/api.php';
        const params = {
            action: 'query',
            format: 'json',
            prop: 'extracts',
            exintro: true,
            titles: city,
            explaintext: true,
        };
        const urlParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            urlParams.append(key, String(value));
        }
        try {
            const response = yield fetch(`${endpoint}?${urlParams.toString()}`);
            const data = yield response.json();
            const pageId = Object.keys(data.query.pages)[0];
            const pageContent = ((_a = data.query.pages[pageId]) === null || _a === void 0 ? void 0 : _a.extract) || 'No information available';
            let limitedContent = pageContent.slice(0, maxLength);
            const sentenceEnd = limitedContent.lastIndexOf('.', limitedContent.lastIndexOf('.') + 1);
            const exclamationEnd = limitedContent.lastIndexOf('!', limitedContent.lastIndexOf('!') + 1);
            const questionEnd = limitedContent.lastIndexOf('?', limitedContent.lastIndexOf('?') + 1);
            const end = Math.max(sentenceEnd, exclamationEnd, questionEnd);
            if (end !== -1) {
                limitedContent = limitedContent.slice(0, end + 1);
            }
            return limitedContent;
        }
        catch (error) {
            console.error('Error fetching city info from MediaWiki:', error);
            return 'Error fetching city information';
        }
    });
}
exports.default = fetchCityInfo;
