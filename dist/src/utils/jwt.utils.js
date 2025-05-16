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
exports.tokenUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_redis_1 = __importDefault(require("./../../config/db.redis"));
const dotenv_1 = require("dotenv");
const error_1 = require("../../config/error");
const response_status_1 = require("../../config/response.status");
(0, dotenv_1.config)();
const secret = process.env.SECRET;
if (!secret) {
    throw new error_1.ApiError(response_status_1.status.JWT_SECRET_NOT_FOUND);
}
exports.tokenUtils = {
    sign: (user) => {
        // access token 발급
        const payload = {
            iss: "https://api.ballog.store",
            sub: user
        };
        return jsonwebtoken_1.default.sign(payload, secret, {
            algorithm: "HS256",
            expiresIn: "1h"
        });
    },
    login: (user_id) => __awaiter(void 0, void 0, void 0, function* () {
        const accessToken = exports.tokenUtils.sign(user_id);
        const refreshToken = exports.tokenUtils.refresh();
        yield db_redis_1.default.set(user_id, refreshToken);
        return [accessToken, refreshToken];
    }),
    verify: (token) => {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            return {
                ok: true,
                sub: decoded.sub
            };
        }
        catch (_a) {
            return {
                ok: false
            };
        }
    },
    refresh: () => {
        return jsonwebtoken_1.default.sign({}, secret, {
            algorithm: "HS256",
            expiresIn: "1y"
        });
    },
    refreshVerify: (token, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield db_redis_1.default.get(userId);
            if (token === data) {
                try {
                    jsonwebtoken_1.default.verify(token, secret);
                    return true;
                }
                catch (_a) {
                    throw new error_1.ApiError(response_status_1.status.JWT_VERIFICATIN_FAILED);
                }
            }
            else {
                return false;
            }
        }
        catch (error) {
            if (error instanceof Error) {
                return false;
            }
            else {
                throw new Error("Unknown Redis error");
            }
        }
    })
};
