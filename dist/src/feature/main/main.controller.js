"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainController = void 0;
const main_service_1 = require("./main.service");
exports.mainController = {
    get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = res.locals.id;
        const result = yield main_service_1.mainService.get(userId);
        res.json(result);
    }),
    patch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = res.locals.id;
        const index = req.body;
        console.log(userId, req.body, "!!");
        const result = yield main_service_1.mainService.patch(userId, index);
        res.json(result);
    })
};
