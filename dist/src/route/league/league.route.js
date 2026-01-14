"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leagueRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const league_controller_1 = require("../../feature/league/league.controller");
exports.leagueRouter = (0, express_1.Router)();
exports.leagueRouter.get("/", (0, express_async_handler_1.default)(league_controller_1.leagueController.get));
