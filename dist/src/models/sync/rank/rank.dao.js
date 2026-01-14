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
exports.rankDao = void 0;
const rank_sql_1 = require("./rank.sql");
const db_pool_1 = require("../../../../config/db.pool");
const response_status_1 = require("../../../../config/response.status");
const error_1 = require("../../../../config/error");
exports.rankDao = {
    patch: (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (!Array.isArray(data) || data.length === 0)
            return;
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            const rows = data.map((item) => ([
                item.seasonId,
                item.leagueId,
                item.teamId,
                item.win,
                item.draw,
                item.lose,
                item.point,
                item.rank,
                item.section,
                item.sectionIdx
            ]));
            yield connection.beginTransaction();
            const [res] = yield connection.query(rank_sql_1.rankSql.patch, [rows]);
            yield connection.commit();
            return res;
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
    })
};
