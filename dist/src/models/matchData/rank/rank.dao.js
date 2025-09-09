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
    post: (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!Array.isArray(data) || data.length === 0)
            return;
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            yield connection.beginTransaction();
            const { sql, params } = rank_sql_1.rankSql.updateBulk(data);
            console.log(sql, params);
            const [res] = yield connection.query(sql, params);
            yield connection.commit();
            return {
                affectedRows: res.affectedRows,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                changedRows: (_a = res.changedRows) !== null && _a !== void 0 ? _a : undefined // mysql2 타입 보완
            };
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
    })
};
