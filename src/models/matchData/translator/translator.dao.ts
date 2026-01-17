import { translatorSql } from "@models/matchData/translator/translator.sql";
import { getPool } from "../../../../config/db.pool";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { status } from "../../../../config/response.status";
import { ApiError } from "../../../../config/error";
import { translatorDto } from "@models/matchData/translator/translator.dto";
import { sentNotification } from "@feature/fcm/sentNotification.controller";

export const translatorDao = {
    post: async (data: translatorDto[]) => {
        if (!Array.isArray(data) || data.length === 0) return;
        const fcmMatchId: string[] = [];
        const connection = await getPool().getConnection();
        try {
            // 1) matchId 있는 항목만 사용
            const valid = data.filter((d) => !!d.matchId);
            if (valid.length === 0) {
                return; // 저장할 것이 없음
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const params: any[] = [];

            // 2) 유효 항목 개수만큼 플레이스홀더 생성
            const placeholders = valid.map(() => "(?, ?, ?, ?)").join(", ");

            // 3) params 구성 (match_id, platform_id, type, url)
            for (const item of valid) {
                if (item.type === "highlight" && item.url) {
                    fcmMatchId.push(item.matchId as string);
                }
                params.push(
                    item.matchId,
                    item.platformId,
                    item.type,
                    item.url
                );
            }
            await connection.beginTransaction();
            await connection.query<ResultSetHeader>(
                translatorSql.post(placeholders),
                params
            );
            await connection.commit();

            // 필요 시 fcmMatchId 반환 가능
            // return { inserted: valid.length, matchIds: fcmMatchId };
        } catch (err) {
            await connection.rollback(); // 롤백 추가
            console.error(err);
            throw new ApiError(status.DATA_INSERTED_SQL_ERROR);
        } finally {
            connection.release();
            for (const matchId of fcmMatchId) {
                await sentNotification(matchId);
            }
        }
    },
    get: async (leagueId: string) => {
        const connection = await getPool().getConnection();
        try {
            const [ result ] = await connection.query<RowDataPacket[]>(
                translatorSql.get,
                [ leagueId, leagueId, leagueId ]
            );
            return result;
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
        // 연결 반환 보장
            connection.release();
        }
    }
};
