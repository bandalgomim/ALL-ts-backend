"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const IAM_route_1 = require("./IAM/IAM.route");
const sns_route_1 = require("./sns/sns.route");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.use("/IAM", (0, express_async_handler_1.default)(IAM_route_1.IAMRouter));
exports.authRouter.use("/sns", (0, express_async_handler_1.default)(sns_route_1.snsRouter));
