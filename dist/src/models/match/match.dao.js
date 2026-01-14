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
exports.matchDao = void 0;
const db_pool_1 = require("../../../config/db.pool");
const error_1 = require("../../../config/error");
const response_status_1 = require("../../../config/response.status");
const match_sql_1 = require("../match/match.sql");
exports.matchDao = {
    get: (userId, matchId) => __awaiter(void 0, void 0, void 0, function* () {
        // match 페이지의 달력과 선호팀에 들어갈 정보를 반환
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            const [result] = yield connection.query(match_sql_1.matchSql.get, [matchId, matchId, userId, userId, matchId]);
            return result;
        }
        catch (err) {
            console.error(err);
            throw new error_1.ApiError(response_status_1.status.DATA_SEARCH_SQL_ERROR);
        }
        finally {
            // 연결 반환 보장
            connection.release();
        }
    })
};
