import { RowDataPacket } from "mysql2/promise";
import { getPool } from "../../../config/db.pool";
import { ApiError } from "../../../config/error";
import { status } from "../../../config/response.status";
import { teamSql } from "./team.sql";


export const teamDao = {
    get: async (userId: string, teamId: number) => {
        // team 페이지의 달력과 선호팀에 들어갈 정보를 반환
        const connection = await getPool().getConnection();
        try {
            const [ result ] = await connection.query<RowDataPacket[]>(teamSql.get,
                [
                    teamId,   // selected_league WHERE a.team_id=?
                    userId,   // team_info: team_list EXISTS user_id
                    userId,   // team_info: icon user_id
                    teamId,   // team_info WHERE t.team_id=?

                    userId,   // match_list(home) EXISTS user_id
                    userId,   // match_list(home) icon i1.user_id
                    userId,   // match_list(home) icon i2.user_id
                    teamId,   // match_list(home) WHERE m.home_team_id=?

                    userId,   // match_list(away) EXISTS user_id
                    userId,   // match_list(away) icon i1.user_id
                    userId,   // match_list(away) icon i2.user_id
                    teamId    // match_list(away) WHERE m.away_team_id=?
                ]);
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
