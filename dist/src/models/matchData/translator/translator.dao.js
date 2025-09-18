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
            // 1) matchId 있는 항목만 사용
            const valid = data.filter((d) => !!d.matchId);
            if (valid.length === 0) {
                return; // 저장할 것이 없음
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const params = [];
            const fcmMatchId = [];
            // 2) 유효 항목 개수만큼 플레이스홀더 생성
            const placeholders = valid.map(() => "(?, ?, ?, ?)").join(", ");
            // 3) params 구성 (match_id, platform_id, type, url)
            for (const item of valid) {
                fcmMatchId.push(item.matchId);
                params.push(item.matchId, item.platformId, item.type, item.url);
            }
            yield connection.beginTransaction();
            yield connection.query(translator_sql_1.translatorSql.post(placeholders), params);
            yield connection.commit();
            // 필요 시 fcmMatchId 반환 가능
            // return { inserted: valid.length, matchIds: fcmMatchId };
        }
        catch (err) {
            yield connection.rollback(); // 롤백 추가
            console.error(err);
            throw new error_1.ApiError(response_status_1.status.DATA_INSERTED_SQL_ERROR);
        }
        finally {
            connection.release();
        }
    })
};
