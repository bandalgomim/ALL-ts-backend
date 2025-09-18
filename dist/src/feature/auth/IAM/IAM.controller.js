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
exports.IAMController = void 0;
const IAM_service_1 = require("./IAM.service");
const setHeader = (res, Authorization, RefreshToken) => {
    res.setHeader("Authorization", "Bearer " + Authorization); // 액세스 토큰을 헤더에 설정
    res.setHeader("RefreshToken", RefreshToken); // 리프레시 토큰을 헤더에 설정
};
exports.IAMController = {
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield IAM_service_1.IAMService.login(res.locals.userId);
        setHeader(res, result[0], result[1]);
        try {
            res.status(200).json({ success: true, icon: res.locals.icon });
        }
        catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    signUp: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield IAM_service_1.IAMService.signUp(res.locals);
        setHeader(res, result[0], result[1]);
        try {
            res.status(200).json({ success: true, icon: res.locals.icon });
        }
        catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    refreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const headers = {
            Authorization: req.headers.authorization,
            RefreshToken: req.headers.refreshtoken
        };
        const result = yield IAM_service_1.IAMService.refreshToken(headers);
        setHeader(res, result, headers.RefreshToken);
    }),
    loginTest: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.body.id;
        const result = yield IAM_service_1.IAMService.login(id);
        setHeader(res, result[0], result[1]);
    }),
    signUpTest: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield IAM_service_1.IAMService.signUp(req.body);
        setHeader(res, result[0], result[1]);
    })
};
