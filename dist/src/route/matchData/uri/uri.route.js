"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uriRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const uri_controller_1 = require("@feature/matchData/uri/uri.controller");
exports.uriRouter = (0, express_1.Router)();
exports.uriRouter.post("/", (0, express_async_handler_1.default)(uri_controller_1.uriController.post));
