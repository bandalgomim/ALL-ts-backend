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
exports.IAMService = void 0;
const error_1 = require("../../../../config/error");
const response_status_1 = require("../../../../config/response.status");
const IAM_dao_1 = require("../../../models/auth/IAM/IAM.dao");
const jwt_utils_1 = require("../../../utils/jwt.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.IAMService = {
    login: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const success = yield IAM_dao_1.IAMDao.getLogin(userId);
        if (success) {
            const [accessToken, refreshToken] = yield jwt_utils_1.tokenUtils.login(userId);
            return [accessToken, refreshToken];
        }
        else {
            throw new error_1.ApiError(response_status_1.status.LOGIN_INFO_UNMATCHED);
        }
    }),
    signUp: (body) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield IAM_dao_1.IAMDao.postSignUp(body);
        if (result === -1) {
            throw new error_1.ApiError(response_status_1.status.EMAIL_ALREADY_EXIST);
        }
        else {
            const [accessToken, refreshToken] = yield jwt_utils_1.tokenUtils.login(body.userId);
            return [accessToken, refreshToken];
        }
    }),
    refreshToken: (headers) => __awaiter(void 0, void 0, void 0, function* () {
        if (headers.Authorization && headers.RefreshToken) {
            const authToken = headers.Authorization.split(" ")[1];
            const refreshToken = headers.RefreshToken;
            const authResult = jwt_utils_1.tokenUtils.verify(authToken);
            const decoded = jsonwebtoken_1.default.decode(authToken);
            if (decoded === null) {
                throw new error_1.ApiError(response_status_1.status.ACCESS_TOKEN_UNMATCHED);
            }
            const refreshResult = yield jwt_utils_1.tokenUtils.refreshVerify(refreshToken, decoded.sub);
            if (authResult.ok === false) {
                // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
                if (refreshResult === false) {
                    throw new error_1.ApiError(response_status_1.status.REFRESH_TOKEN_UNMATCHED);
                }
                else {
                    // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
                    const newAccessToken = jwt_utils_1.tokenUtils.sign(decoded.sub);
                    return newAccessToken;
                }
            }
            else {
                // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
                throw new error_1.ApiError(response_status_1.status.ACCESS_TOKEN_IS_VALID);
            }
        }
        else { // access token 또는 refresh token이 헤더에 없는 경우
            if (!headers.Authorization && !headers.RefreshToken) {
                throw new error_1.ApiError(response_status_1.status.THERE_IS_NO_TOKEN);
            }
            else if (!headers.RefreshToken) {
                throw new error_1.ApiError(response_status_1.status.THERE_IS_NO_REFRESH_TOKEN);
            }
            else {
                throw new error_1.ApiError(response_status_1.status.THERE_IS_NO_ACCESS_TOKEN);
            }
        }
    }),
    patchFcmToken: (userId, body) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield IAM_dao_1.IAMDao.patchFcmToken(userId, body.token);
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    })
};
