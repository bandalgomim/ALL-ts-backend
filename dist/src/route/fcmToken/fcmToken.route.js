"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fcmTokenRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const fcmToken_controller_1 = require("../../fcmToken/fcmToken.controller");
exports.fcmTokenRouter = (0, express_1.Router)();
exports.fcmTokenRouter.patch("/", (0, express_async_handler_1.default)(fcmToken_controller_1.fcmTokenController.patch));
