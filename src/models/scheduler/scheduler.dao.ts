import { schedulerSql } from "./scheduler.sql";
import { getPool } from "../../../config/db.pool";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { status } from "../../../config/response.status";
import { ApiError } from "../../../config/error";
import { schedulerDto } from "./scheduler.dto";

export const schedulerDao = {
    get: async (date: string): Promise<RowDataPacket[]> => {
        const connection = await getPool().getConnection();
        try {
            const [ rows ] = await connection.query<RowDataPacket[]>(schedulerSql.get, [ date ]);
            return rows; // 쿼리 결과 반환 추가
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
            // 연결 반환 보장
            connection.release();
        }
    },
    post: async (data: schedulerDto[]) => {
        if (!Array.isArray(data) || data.length === 0) return;
        const connection = await getPool().getConnection();
        try {
            const params = [];
            const placeholders = data.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
            for (const item of data) {
                params.push(
                    `${item.date}-${item.homeTeamId}-${item.awayTeamId}-${item.doubleHeader}`,
                    item.leagueId,
                    item.homeTeamId,
                    item.awayTeamId,
                    `${item.date} ${item.time}`,
                    item.status,
                    item.homeTeamScore,
                    item.awayTeamScore
                );
            }
            await connection.beginTransaction();
            await connection.query<ResultSetHeader>(schedulerSql.post(placeholders), params);
            await connection.commit();
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
            // 연결 반환 보장
            connection.release();
        }
    }
};
