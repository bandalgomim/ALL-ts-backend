"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iconRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const icon_controller_1 = require("../../feature/icon/icon.controller");
exports.iconRouter = (0, express_1.Router)();
exports.iconRouter.patch("/", (0, express_async_handler_1.default)(icon_controller_1.iconController.patch));
exports.iconRouter.delete("/", (0, express_async_handler_1.default)(icon_controller_1.iconController.delete));
