"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulerRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const scheduler_controller_1 = require("../../feature/scheduler/scheduler.controller");
exports.schedulerRouter = (0, express_1.Router)();
exports.schedulerRouter.get("/", (0, express_async_handler_1.default)(scheduler_controller_1.schedulerController.get));
exports.schedulerRouter.post("/", (0, express_async_handler_1.default)(scheduler_controller_1.schedulerController.post));
