"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toISOString().split('.')[0] + 'Z';
}
exports.default = formatDate;
