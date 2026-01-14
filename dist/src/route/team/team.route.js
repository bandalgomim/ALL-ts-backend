"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const team_controller_1 = require("@feature/team/team.controller");
exports.teamRouter = (0, express_1.Router)();
exports.teamRouter.get("/", (0, express_async_handler_1.default)(team_controller_1.teamController.get));
