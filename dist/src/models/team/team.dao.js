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
exports.teamDao = void 0;
const db_pool_1 = require("../../../config/db.pool");
const error_1 = require("../../../config/error");
const response_status_1 = require("../../../config/response.status");
const team_sql_1 = require("./team.sql");
exports.teamDao = {
    get: (userId, teamId) => __awaiter(void 0, void 0, void 0, function* () {
        // team 페이지의 달력과 선호팀에 들어갈 정보를 반환
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            const [result] = yield connection.query(team_sql_1.teamSql.get, [
                teamId, // selected_league WHERE a.team_id=?
                userId, // team_info: team_list EXISTS user_id
                userId, // team_info: icon user_id
                teamId, // team_info WHERE t.team_id=?
                userId, // match_list(home) EXISTS user_id
                userId, // match_list(home) icon i1.user_id
                userId, // match_list(home) icon i2.user_id
                teamId, // match_list(home) WHERE m.home_team_id=?
                userId, // match_list(away) EXISTS user_id
                userId, // match_list(away) icon i1.user_id
                userId, // match_list(away) icon i2.user_id
                teamId // match_list(away) WHERE m.away_team_id=?
            ]);
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
