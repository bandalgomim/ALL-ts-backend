"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translatorRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const translator_controller_1 = require("../../../feature/matchData/translator/translator.controller");
exports.translatorRouter = (0, express_1.Router)();
exports.translatorRouter.post("/", (0, express_async_handler_1.default)(translator_controller_1.translatorController.post));
