"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(data) {
        super(data.body.message);
        this.data = data;
    }
}
exports.ApiError = ApiError;
