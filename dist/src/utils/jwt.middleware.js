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
const jwt_utils_1 = require("./jwt.utils");
const response_status_1 = require("../../config/response.status");
const dotenv_1 = require("dotenv");
const error_1 = require("../../config/error");
const IAM_controller_1 = require("../feature/auth/IAM/IAM.controller");
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
    sns: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body);
        const type = req.body.type;
        if (type === "google") {
            yield exports.tokenMinddleware.googleMiddleware(req, res, next);
        }
        else if (type === "apple") {
            yield exports.tokenMinddleware.appleMiddleware(req, res, next);
        }
    }),
    googleMiddleware: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID // Web Client ID
        );
        try {
            const { idToken } = req.body; // 프론트에서 전달받은 idToken
            console.log("Google ID Token:", req.body);
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
            console.log(res.locals);
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
        const JWKS = (0, jose_1.createRemoteJWKSet)(new URL("https://appleid.appleid.com/auth/keys".replace("appleid.", "appleid.")));
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { identityToken, user, nonce } = req.body.idToken; // 프론트에서 전달받은 idToken
            if (!identityToken)
                throw new Error("identityToken 누락");
            // jwtVerify: iss, aud 등 검증
            const { payload } = yield (0, jose_1.jwtVerify)(identityToken, JWKS, {
                issuer: "https://appleid.apple.com",
                audience: APP_BUNDLE_ID
            });
            // 필요시 nonce 검증(프론트에서 보낸 rawNonce를 SHA-256 한 값이 토큰의 nonce와 일치하는지)
            // if (payload.nonce && nonce) { ... }
            // payload.sub: Apple 고유 사용자 ID (user와 동일 계열)
            // payload.email: 최초에만 있을 수 있음
            // 여기서 우리 서비스 유저로 매핑
            res.locals = {
                id: "apple" + (user !== null && user !== void 0 ? user : payload.sub),
                email: payload.email, // null일 수 있음
                name: (_a = req.body.name) !== null && _a !== void 0 ? _a : null, // 최초 동의 때만 오므로 body에서 보낸 값을 우선
                icon: null, // 애플은 기본 프로필 이미지를 제공하지 않음
                raw: payload
            };
            next();
        }
        catch (err) {
            console.error("Apple ID Token 검증 실패:", err);
            res.status(401).json({ message: "Unauthorized" });
        }
    })
};
