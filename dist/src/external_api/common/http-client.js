"use strict";
/**
 * HTTP 클라이언트 공통 모듈
 */
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
exports.HttpClient = void 0;
exports.createApiFootballClient = createApiFootballClient;
exports.createPandaScoreClient = createPandaScoreClient;
const axios_1 = __importDefault(require("axios"));
class HttpClient {
    constructor(config) {
        this.client = axios_1.default.create({
            baseURL: config.baseURL,
            headers: config.headers,
            timeout: config.timeout || 30000
        });
    }
    get(url, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.get(url, { params });
                return response.data;
            }
            catch (error) {
                this.handleError(error);
                throw error;
            }
        });
    }
    post(url, data, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.post(url, data, config);
                return response.data;
            }
            catch (error) {
                this.handleError(error);
                throw error;
            }
        });
    }
    handleError(error) {
        if (error.response) {
            console.error(`HTTP Error ${error.response.status}:`, error.response.data);
        }
        else if (error.request) {
            console.error("No response received:", error.message);
        }
        else {
            console.error("Request error:", error.message);
        }
    }
}
exports.HttpClient = HttpClient;
/**
 * API-Football 클라이언트 생성
 */
function createApiFootballClient() {
    const apiKey = process.env.API_SPORTS_KEY || "ee5eb956fb3e410df048f3f6a73a30e7";
    return new HttpClient({
        baseURL: "https://v3.football.api-sports.io",
        headers: {
            "x-apisports-key": apiKey
        },
        timeout: 30000
    });
}
/**
 * PandaScore 클라이언트 생성
 */
function createPandaScoreClient() {
    const apiKey = process.env.PANDASCORE_API_KEY || "-GBm5bFNYgi3202Zbvmk6s2mO34r2YRdoapFnJzNUXkRKaRRNiY";
    return new HttpClient({
        baseURL: "https://api.pandascore.co",
        headers: {
            Authorization: `Bearer ${apiKey}`
        },
        timeout: 30000
    });
}
