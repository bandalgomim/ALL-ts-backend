"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.snsRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const sns_controller_1 = require("../../../feature/auth/sns/sns.controller");
const redirect_controller_1 = require("../../../feature/auth/redirect/redirect.controller");
exports.snsRouter = (0, express_1.Router)();
exports.snsRouter.get("/naver", (0, express_async_handler_1.default)(sns_controller_1.snsController.naver));
exports.snsRouter.get("/naver/redirect", (0, express_async_handler_1.default)(redirect_controller_1.redirectController.naver));
