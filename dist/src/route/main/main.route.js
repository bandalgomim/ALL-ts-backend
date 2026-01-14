"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const main_controller_1 = require("../../feature/main/main.controller");
exports.mainRouter = (0, express_1.Router)();
exports.mainRouter.get("/", (0, express_async_handler_1.default)(main_controller_1.mainController.get));
exports.mainRouter.patch("/", (0, express_async_handler_1.default)(main_controller_1.mainController.patch));
