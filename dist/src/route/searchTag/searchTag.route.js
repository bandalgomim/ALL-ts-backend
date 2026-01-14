"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTagRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const searchTag_controller_1 = require("@feature/searchTag/searchTag.controller");
exports.searchTagRouter = (0, express_1.Router)();
exports.searchTagRouter.get("/", (0, express_async_handler_1.default)(searchTag_controller_1.searchTagController.get));
