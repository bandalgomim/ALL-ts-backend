"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const IAM_controller_1 = require("@feature/IAM/IAM.controller");
const jwt_middleware_1 = require("@src/utils/jwt.middleware");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/login/google", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.googleMiddleware), (0, express_async_handler_1.default)(IAM_controller_1.IAMController.login));
exports.authRouter.post("/signUp/google", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.googleMiddleware), (0, express_async_handler_1.default)(IAM_controller_1.IAMController.signUp));
exports.authRouter.post("/login/apple", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.appleMiddleware), (0, express_async_handler_1.default)(IAM_controller_1.IAMController.login));
exports.authRouter.post("/signUp/apple", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.appleMiddleware), (0, express_async_handler_1.default)(IAM_controller_1.IAMController.signUp));
exports.authRouter.get("/refreshToken", (0, express_async_handler_1.default)(IAM_controller_1.IAMController.refreshToken));
exports.authRouter.delete("/delete", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.auth), (0, express_async_handler_1.default)(IAM_controller_1.IAMController.delete));
