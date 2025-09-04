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
exports.translatorDao = void 0;
const translator_sql_1 = require("./translator.sql");
const db_pool_1 = require("../../../../config/db.pool");
const response_status_1 = require("../../../../config/response.status");
const error_1 = require("../../../../config/error");
exports.translatorDao = {
    post: (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (!Array.isArray(data) || data.length === 0)
            return;
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            const params = [];
            const placeholders = data.map(() => "(?, ?, ?, ?)").join(", ");
            for (const item of data) {
                params.push(`${item.date.split(" ")[0]}-${item.homeTeamId}-${item.awayTeamId}-${item.doubleHeader}`, item.platformId, item.type, item.url);
            }
            yield connection.beginTransaction();
            yield connection.query(translator_sql_1.translatorSql.post(placeholders), params);
            yield connection.commit();
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
