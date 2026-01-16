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
const match_sql_1 = require("./match.sql");
const db_pool_1 = require("../../../../config/db.pool");
const response_status_1 = require("../../../../config/response.status");
const error_1 = require("../../../../config/error");
exports.matchDao = {
    get: (date) => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            const [rows] = yield connection.query(match_sql_1.matchSql.get, [date]);
            return rows; // 쿼리 결과 반환 추가
        }
        catch (err) {
            console.error(err);
            throw new error_1.ApiError(response_status_1.status.DATA_SEARCH_SQL_ERROR);
        }
        finally {
            // 연결 반환 보장
            connection.release();
        }
    }),
    patch: (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (!Array.isArray(data) || data.length === 0)
            return false;
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            // VALUES ?에 넣을 2차원 배열 생성
            const rows = data.map((item) => ([
                item.matchId, // match_id
                item.leagueId,
                item.homeTeamId ? item.homeTeamId : "TBD",
                item.awayTeamId ? item.awayTeamId : "TBD",
                item.date,
                item.status,
                item.homeTeamScore ? item.homeTeamScore : 0,
                item.awayTeamScore ? item.awayTeamScore : 0,
                item.doubleHeader,
                item.seasonId
            ]));
            yield connection.beginTransaction();
            yield connection.query(match_sql_1.matchSql.patch, [rows]);
            yield connection.commit();
            return true;
        }
        catch (err) {
            console.error(err);
            try {
                yield connection.rollback();
            }
            catch ( /* empty */_a) { /* empty */ }
            throw new error_1.ApiError(response_status_1.status.DATA_SEARCH_SQL_ERROR);
        }
        finally {
            connection.release();
        }
    }),
    patchMatchList: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!Array.isArray(data) || data.length === 0)
            return 0;
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            const matchListRows = data.map((item) => ([
                item.matchId,
                item.homeTeamId ? item.homeTeamId : "TBD",
                item.awayTeamId ? item.awayTeamId : "TBD",
            ]));
            yield connection.beginTransaction();
            yield connection.query(match_sql_1.matchSql.patchMatchList.createTmpNewMatches);
            yield connection.query(match_sql_1.matchSql.patchMatchList.truncateTmpNewMatches);
            yield connection.query(match_sql_1.matchSql.patchMatchList.insertTmpNewMatches, [matchListRows]);
            const [result] = yield connection.query(match_sql_1.matchSql.patchMatchList.insertMatchListFromTmp);
            yield connection.commit();
            return (_a = result.affectedRows) !== null && _a !== void 0 ? _a : 0;
        }
        catch (err) {
            console.error(err);
            try {
                yield connection.rollback();
            }
            catch ( /* empty */_b) { /* empty */ }
            throw new error_1.ApiError(response_status_1.status.DATA_SEARCH_SQL_ERROR);
        }
        finally {
            connection.release();
        }
    }),
};
