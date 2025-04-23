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
exports.snsController = void 0;
const sns_service_1 = require("./sns.service");
exports.snsController = {
    google: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield sns_service_1.snsService.google();
        res.redirect(result);
    }),
    kakao: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield sns_service_1.snsService.kakao();
        res.redirect(result);
    }),
    naver: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield sns_service_1.snsService.naver();
        console.log("result", result);
        res.json(result);
    })
};
