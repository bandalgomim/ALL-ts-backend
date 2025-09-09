"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const rank_controller_1 = require("../../../feature/matchData/rank/rank.controller");
exports.rankRouter = (0, express_1.Router)();
exports.rankRouter.post("/", (0, express_async_handler_1.default)(rank_controller_1.rankController.post));
