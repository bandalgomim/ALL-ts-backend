"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IAMRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const IAM_controller_1 = require("../../../feature/auth/IAM/IAM.controller");
const jwt_middleware_1 = require("../../../utils/jwt.middleware");
exports.IAMRouter = (0, express_1.Router)();
exports.IAMRouter.post("/login/google", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.googleMiddleware), (0, express_async_handler_1.default)(IAM_controller_1.IAMController.login));
exports.IAMRouter.post("/signUp/google", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.googleMiddleware), (0, express_async_handler_1.default)(IAM_controller_1.IAMController.signUp));
exports.IAMRouter.post("/login/apple", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.appleMiddleware), (0, express_async_handler_1.default)(IAM_controller_1.IAMController.login));
exports.IAMRouter.post("/signUp/apple", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.appleMiddleware), (0, express_async_handler_1.default)(IAM_controller_1.IAMController.signUp));
exports.IAMRouter.post("/signUpTest", (0, express_async_handler_1.default)(IAM_controller_1.IAMController.signUpTest));
exports.IAMRouter.get("/refreshToken", (0, express_async_handler_1.default)(IAM_controller_1.IAMController.refreshToken));
exports.IAMRouter.post("/loginTest", (0, express_async_handler_1.default)(IAM_controller_1.IAMController.loginTest));
