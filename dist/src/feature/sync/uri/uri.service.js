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
exports.uriService = void 0;
const db_redis_1 = __importDefault(require("../../../../config/db.redis"));
exports.uriService = {
    post: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(data);
            const res = [];
            for (const uri of data) {
                const key = `uri:${uri.uri}`;
                const ok = yield db_redis_1.default.set(key, "1", {
                    NX: true,
                    EX: 72 * 60 * 60
                });
                if (ok === "OK") {
                    res.push(uri);
                }
            }
            return res;
        }
        catch (error) {
            console.error("Error in uriService.post:", error);
            throw error;
        }
    })
};
