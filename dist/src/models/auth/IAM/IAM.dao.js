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
exports.IAMDao = void 0;
const IAM_sql_1 = require("./IAM.sql");
const db_pool_1 = require("./../../../../config/db.pool");
const response_status_1 = require("../../../../config/response.status");
const error_1 = require("../../../../config/error");
exports.IAMDao = {
    postSignUp: (body) => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            const [CheckEamil] = yield connection.query(IAM_sql_1.IAMSql.getEmail, [body.email]);
            const isEmailExist = CheckEamil[0].isExistEmail;
            if (isEmailExist) {
                return -1;
            }
            const [result] = yield connection.query(IAM_sql_1.IAMSql.postSignUp, [body.userId, body.email, body.nickname, body.icon]);
            return result.insertId;
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
    getLogin: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield (0, db_pool_1.getPool)().getConnection();
        try {
            const [result] = yield connection.query(IAM_sql_1.IAMSql.getLogin, [userId]);
            const isExistUser = result[0].isExistUser;
            return isExistUser;
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
