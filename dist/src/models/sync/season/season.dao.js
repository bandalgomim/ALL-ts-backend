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
exports.seasonDao = void 0;
const db_pool_1 = require("../../../../config/db.pool");
const error_1 = require("../../../../config/error");
const response_status_1 = require("../../../../config/response.status");
const season_sql_1 = require("./season.sql");
exports.seasonDao = {
    patch: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            yield connection.beginTransaction();
            yield connection.query(season_sql_1.seasonSql.patchLeague, [req.leagueId, req.leagueName, req.leagueInitial, req.leagueLogo, req.sportId, req.countryId]);
            yield connection.query(season_sql_1.seasonSql.patchSeasonState, [req.leagueId]);
            const [result] = yield connection.query(season_sql_1.seasonSql.patchSeason, [req.seasonId, req.leagueId, req.seasonName, req.seasonStart, req.seasonEnd]);
            yield connection.commit();
            return result.affectedRows > 0;
        }
        catch (err) {
            console.error(err);
            throw new error_1.ApiError(response_status_1.status.DATA_SEARCH_SQL_ERROR);
        }
        finally {
            connection.release();
        }
    })
};
