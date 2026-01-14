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
exports.mainDao = void 0;
const db_pool_1 = require("../../../config/db.pool");
const error_1 = require("../../../config/error");
const response_status_1 = require("../../../config/response.status");
const main_sql_1 = require("../main/main.sql");
exports.mainDao = {
    get: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        // main 페이지의 달력과 선호팀에 들어갈 정보를 반환
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            const [result] = yield connection.query(main_sql_1.mainSql.get, [userId, userId, userId, userId, userId, userId, userId, userId]);
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
    }),
    patch: (userId, items) => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            yield connection.beginTransaction();
            const teamItems = items.filter((item) => "teamId" in item);
            if (teamItems.length > 0) {
                const query = main_sql_1.mainSql.patchTeamList(teamItems);
                const values = teamItems.flatMap(({ teamId, index }) => [teamId, index]).concat(teamItems.map(({ teamId }) => teamId));
                yield connection.query(query, values);
            }
            const leagueItems = items.filter((item) => "leagueId" in item);
            if (leagueItems.length > 0) {
                const query = main_sql_1.mainSql.patchLeagueList(leagueItems);
                const values = leagueItems.flatMap(({ leagueId, index }) => [leagueId, index]).concat(leagueItems.map(({ leagueId }) => leagueId));
                yield connection.query(query, values);
            }
            yield connection.commit();
        }
        catch (err) {
            console.error(err);
            throw new error_1.ApiError(response_status_1.status.DATA_UPDATED_SQL_ERROR);
        }
        finally {
            connection.release();
        }
    })
};
