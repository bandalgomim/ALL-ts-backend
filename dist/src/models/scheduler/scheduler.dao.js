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
exports.schedulerDao = void 0;
const scheduler_sql_1 = require("../scheduler/scheduler.sql");
const db_pool_1 = require("../../../config/db.pool");
const response_status_1 = require("../../../config/response.status");
const error_1 = require("../../../config/error");
exports.schedulerDao = {
    get: () => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            const [rows] = yield connection.query(scheduler_sql_1.schedulerSql.get, []);
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
    })
};
