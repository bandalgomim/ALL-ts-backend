"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchDataRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const uri_route_1 = require("./uri/uri.route");
const translator_route_1 = require("./translator/translator.route");
const rank_route_1 = require("./rank/rank.route");
exports.matchDataRouter = (0, express_1.Router)();
exports.matchDataRouter.use("/uri", (0, express_async_handler_1.default)(uri_route_1.uriRouter));
exports.matchDataRouter.use("/rank", (0, express_async_handler_1.default)(rank_route_1.rankRouter));
exports.matchDataRouter.use("/translator", (0, express_async_handler_1.default)(translator_route_1.translatorRouter));
