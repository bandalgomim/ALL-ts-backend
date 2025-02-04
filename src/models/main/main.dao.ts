import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getPool } from "../../../config/db.pool";
import { ApiError } from "../../../config/error";
import { status } from "../../../config/response.status";
import { mainSql } from "./main.sql";


export const mainDao = {
    get: async (userId: string) => {
        // main 페이지의 달력과 선호팀에 들어갈 정보를 반환
        const connection = await getPool().getConnection();
        try {
            const [ result ] = await connection.query<RowDataPacket[]>(mainSql.get, [ userId, userId ]);
            return result;
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
        // 연결 반환 보장
            connection.release();
        }
    },
    deleteMatch: async (userId: string, matchId: number) => {
        // 해당 match를 달력에서 삭제
        const connection = await getPool().getConnection();
        try {
            await connection.query<ResultSetHeader>(mainSql.deleteMatch, [ userId, matchId ]);
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_UPDATED_SQL_ERROR);
        } finally {
        // 연결 반환 보장
            connection.release();
        }
    }
};
