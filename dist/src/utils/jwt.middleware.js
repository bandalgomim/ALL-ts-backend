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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenMinddleware = void 0;
const jwt_utils_1 = require("./jwt.utils");
const response_status_1 = require("../../config/response.status");
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const error_1 = require("../../config/error");
const IAM_controller_1 = require("../feature/auth/IAM/IAM.controller");
(0, dotenv_1.config)();
exports.tokenMinddleware = {
    auth: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.headers.authorization) {
            const accessToken = req.headers.authorization;
            const token = accessToken.split(" ")[1];
            const result = jwt_utils_1.tokenUtils.verify(token); // token을 검증합니다.
            if (result.ok) {
                res.locals.id = result.sub;
                next();
            }
            else {
                yield IAM_controller_1.IAMController.refreshToken(req, res);
            }
        }
        else {
            throw new error_1.ApiError(response_status_1.status.THERE_IS_NO_ACCESS_TOKEN);
        }
    }),
    google: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const urlPath = req.originalUrl; // 쿼리스트링을 제외한 경로만 가져옵니다.
        const signUpRegex = /\/signUp\//;
        let redirectUri = null;
        if (signUpRegex.test(urlPath)) {
            redirectUri = process.env.GOOGLE_REDIRECT_URI_SIGN_UP;
        }
        else {
            redirectUri = process.env.GOOGLE_REDIRECT_URI_LOGIN;
        }
        const { code } = req.query;
        const token = yield axios_1.default.post(process.env.GOOGLE_TOKEN_URL, {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: redirectUri,
            grant_type: "authorization_code"
        });
        const userInfo = yield axios_1.default.get(process.env.GOOGLE_USERINFO_URL, {
            headers: {
                Authorization: "Bearer " + token.data.access_token
            }
        });
        res.locals = {
            id: "google" + userInfo.data.id,
            email: userInfo.data.email,
            name: userInfo.data.name,
            icon: userInfo.data.picture
        };
        next();
    }),
    naver: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const code = req.query.code;
        const state = req.query.state;
        const data = {
            grant_type: "authorization_code",
            response_type: "code",
            client_id: process.env.NAVER_CLIENT_ID,
            client_secret: process.env.NAVER_CLIENT_SECRET,
            redirect_uri: process.env.NAVER_REDIRECT_URI,
            code: code,
            state: state
        };
        const naverToken = yield axios_1.default.post(process.env.NAVER_TOKEN_URL, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        const header = {
            Authorization: "Bearer " + naverToken.data.access_token
        };
        const userInfo = yield axios_1.default.get(process.env.NAVER_USERINFO_URL, {
            headers: header
        });
        res.locals = {
            id: "naver" + userInfo.data.response.id,
            email: userInfo.data.response.email,
            name: userInfo.data.response.name,
            icon: userInfo.data.response.profile_image
        };
        next();
    }),
    kakao: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { code } = req.query;
        const data = {
            grant_type: "authorization_code",
            client_id: process.env.KAKAO_CLIENT_ID,
            code: code
        };
        const queryString = `grant_type=${data.grant_type}&client_id=${data.client_id}&code=${data.code}`;
        const kakaoToken = yield axios_1.default.post(process.env.KAKAO_TOKEN_URL, queryString);
        const header = {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            Authorization: "Bearer " + kakaoToken.data.access_token
        };
        const userInfo = yield axios_1.default.get(process.env.KAKAO_USERINFO_URL, {
            headers: header
        });
        res.locals = {
            id: "kakao" + userInfo.data.id,
            email: userInfo.data.kakao_account.email,
            name: "test",
            icon: userInfo.data.properties.profile_image
        };
        next();
    })
};
