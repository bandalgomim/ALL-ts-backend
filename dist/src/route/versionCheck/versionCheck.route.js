"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionCheckRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const versionCheck_controller_1 = require("@feature/versionCheck/versionCheck.controller");
exports.versionCheckRouter = (0, express_1.Router)();
exports.versionCheckRouter.post("/", (0, express_async_handler_1.default)(versionCheck_controller_1.versionCheckController.post));
