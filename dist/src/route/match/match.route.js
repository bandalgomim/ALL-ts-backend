"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const match_controller_1 = require("../../feature/match/match.controller");
exports.matchRouter = (0, express_1.Router)();
exports.matchRouter.get("/", (0, express_async_handler_1.default)(match_controller_1.matchController.get));
