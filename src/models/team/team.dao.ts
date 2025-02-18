import { RowDataPacket } from "mysql2/promise";
import { getPool } from "../../../config/db.pool";
import { ApiError } from "../../../config/error";
import { status } from "../../../config/response.status";
import { teamSql } from "./team.sql";


export const teamDao = {
    get: async (teamId: number) => {
        // team 페이지의 달력과 선호팀에 들어갈 정보를 반환
        const connection = await getPool().getConnection();
        console.log("teamDao.get: teamId= " + teamId);
        try {
            const [ result ] = await connection.query<RowDataPacket[]>(teamSql.get, [ teamId ]);
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
