"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSelectedRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const isSelected_controller_1 = require("@feature/isSelected/isSelected.controller");
exports.isSelectedRouter = (0, express_1.Router)();
exports.isSelectedRouter.patch("/", (0, express_async_handler_1.default)(isSelected_controller_1.isSelectedController.patch));
