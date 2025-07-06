import { RowDataPacket } from "mysql2/promise";
import { getPool } from "../../../config/db.pool";
import { ApiError } from "../../../config/error";
import { status } from "../../../config/response.status";
import { mainSql } from "./main.sql";
import { patchMainReqDto } from "./main.dto";


export const mainDao = {
    get: async (userId: string) => {
        // main 페이지의 달력과 선호팀에 들어갈 정보를 반환
        const connection = await getPool().getConnection();
        try {
            const [ result ] = await connection.query<RowDataPacket[]>(mainSql.get,
                [ userId, userId, userId, userId, userId, userId, userId, userId ]);
            return result;
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
        // 연결 반환 보장
            connection.release();
        }
    },
    patch: async (userId: string, items: patchMainReqDto[]) => {
        const connection = await getPool().getConnection();
        try {
            await connection.beginTransaction();

            const teamItems = items.filter((item) => "teamId" in item);
            if (teamItems.length > 0) {
                const query = mainSql.patchTeamList(teamItems);
                const values = teamItems.flatMap(({ teamId, index }) =>
                    [ teamId, index ]).concat(teamItems.map(({ teamId }) => teamId));
                await connection.query(query, values);
            }
            const leagueItems = items.filter((item) => "leagueId" in item);
            if (leagueItems.length > 0) {
                const query = mainSql.patchLeagueList(leagueItems);
                const values = leagueItems.flatMap(({ leagueId, index }) =>
                    [ leagueId, index ]).concat(leagueItems.map(({ leagueId }) => leagueId));
                await connection.query(query, values);
            }
            await connection.commit();
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_UPDATED_SQL_ERROR);
        } finally {
            connection.release();
        }
    }
};
