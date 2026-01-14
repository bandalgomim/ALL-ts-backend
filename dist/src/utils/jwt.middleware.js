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
exports.tokenMinddleware = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const response_status_1 = require("../../config/response.status");
const dotenv_1 = require("dotenv");
const error_1 = require("../../config/error");
const IAM_controller_1 = require("../feature/IAM/IAM.controller");
const google_auth_library_1 = require("google-auth-library");
const jose_1 = require("jose");
(0, dotenv_1.config)();
exports.tokenMinddleware = {
    auth: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.headers.authorization) {
            const accessToken = req.headers.authorization;
            const token = accessToken.split(" ")[1];
            const result = jwt_utils_1.tokenUtils.verify(token); // token을 검증합니다.
            if (result.ok) {
                res.locals.userId = result.sub;
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
    googleMiddleware: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID // Web Client ID
        );
        try {
            const { idToken } = req.body; // 프론트에서 전달받은 idToken
            // ✅ 토큰 검증 및 디코드
            const ticket = yield client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_WEB_CLIENT_ID
            });
            const payload = ticket.getPayload();
            if (!payload)
                throw new Error("Invalid token");
            // payload 안에 들어 있는 값
            // sub: 구글 고유 ID, email, name, picture 등
            res.locals = {
                userId: "google" + payload.sub,
                email: payload.email,
                name: payload.name,
                icon: payload.picture
            };
            next();
        }
        catch (err) {
            console.error("Google ID Token 검증 실패:", err);
            res.status(401).json({ success: false, error: "Invalid Google token" });
        }
    }),
    appleMiddleware: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const APP_BUNDLE_ID = process.env.APP_BUNDLE_ID; // e.g. com.yourcompany.yourapp
        const JWKS = (0, jose_1.createRemoteJWKSet)(new URL("https://appleid.apple.com/auth/keys".replace("appleid.", "appleid.")));
        try {
            const { identityToken } = req.body.idToken; // 프론트에서 전달받은 idToken
            if (!identityToken)
                throw new Error("identityToken 누락");
            const { payload } = yield (0, jose_1.jwtVerify)(identityToken, JWKS, {
                issuer: "https://appleid.apple.com",
                audience: APP_BUNDLE_ID
            });
            res.locals = {
                userId: "apple" + payload.sub,
                email: payload.email,
                name: (_a = req.body.name) !== null && _a !== void 0 ? _a : null,
                icon: null
            };
            next();
        }
        catch (err) {
            console.error("Apple ID Token 검증 실패:", err);
            res.status(401).json({ message: "Unauthorized" });
        }
    })
};
