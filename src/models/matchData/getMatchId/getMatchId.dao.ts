import { RowDataPacket } from "mysql2/promise";
import { getPool } from "../../../../config/db.pool";
import { ApiError } from "../../../../config/error";
import { status } from "../../../../config/response.status";
import { getMatchIdSql } from "./getMatchId.sql";

export const getMatchIdDao = {
    get: async (date: string, homeTeamId: string, awayTeamId: string, dh: number) => {
        const connection = await getPool().getConnection();
        try {
            const [ result ] = await connection.query<RowDataPacket[]>(getMatchIdSql.get,
                [ dh, homeTeamId, awayTeamId, date, date ]);
            return result.length > 0 ? (result[0].match_id as string) : null;
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
        // 연결 반환 보장
            connection.release();
        }
    }
};

