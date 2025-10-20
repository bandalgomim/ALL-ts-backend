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
exports.fcmDao = void 0;
const fcm_sql_1 = require("./fcm.sql");
const db_pool_1 = require("../../../config/db.pool");
const response_status_1 = require("../../../config/response.status");
const error_1 = require("../../../config/error");
exports.fcmDao = {
    patchFcmToken: (userId, token) => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            yield connection.query(fcm_sql_1.fcmSql.patchFcmToken, [token, userId]);
        }
        catch (err) {
            console.error(err);
            throw new error_1.ApiError(response_status_1.status.DATA_INSERTED_SQL_ERROR);
        }
        finally {
            // 연결 반환 보장
            connection.release();
        }
    }),
    get: (matchId) => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            const [rows] = yield connection.query(fcm_sql_1.fcmSql.get, [matchId]);
            return rows;
        }
        catch (err) {
            console.error(err);
            throw new error_1.ApiError(response_status_1.status.DATA_INSERTED_SQL_ERROR);
        }
        finally {
            // 연결 반환 보장
            connection.release();
        }
    }),
    getLive: (matchId) => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            const [rows] = yield connection.query(fcm_sql_1.fcmSql.getLive, [matchId]);
            return rows;
        }
        catch (err) {
            console.error(err);
            throw new error_1.ApiError(response_status_1.status.DATA_INSERTED_SQL_ERROR);
        }
        finally {
            // 연결 반환 보장
            connection.release();
        }
    }),
    getFcmToken: (matchId) => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            const [rows] = yield connection.query(fcm_sql_1.fcmSql.getFcmToken, [matchId]);
            return rows.map((row) => Object.values(row)[0]);
        }
        catch (err) {
            console.error(err);
            throw new error_1.ApiError(response_status_1.status.DATA_INSERTED_SQL_ERROR);
        }
        finally {
            // 연결 반환 보장
            connection.release();
        }
    })
};
