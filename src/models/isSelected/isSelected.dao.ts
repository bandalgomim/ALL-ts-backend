import { RowDataPacket } from "mysql2/promise";
import { getPool } from "../../../config/db.pool";
import { ApiError } from "../../../config/error";
import { status } from "../../../config/response.status";
import { isSelectedSql } from "@models/isSelected/isSelected.sql";


export const isSelectedDao = {

    patchTeam: async (userId: string, teamId: number) => {
        // isSelected 페이지의 달력과 선호팀에 들어갈 정보를 반환
        const connection = await getPool().getConnection();
        try {
            await connection.query<RowDataPacket[]>(isSelectedSql.patchTeam, [ userId, teamId ]);

            // await connection.query<RowDataPacket[]>(isSelectedSql.updateleague, [ teamId, teamId, userId ]);
            return;
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
        // 연결 반환 보장
            connection.release();
        }
    },
    patchMatch: async (userId: string, matchId: string) => {
        // isSelected 페이지의 달력과 선호팀에 들어갈 정보를 반환
        const connection = await getPool().getConnection();
        try {
            const [ result ] = await connection.query<RowDataPacket[]>(isSelectedSql.patchMatch, [ userId, matchId ]);
            return result;
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
        // 연결 반환 보장
            connection.release();
        }
    },
    patchLeague: async (userId: string, leagueId: number) => {
        // isSelected 페이지의 달력과 선호팀에 들어갈 정보를 반환
        const connection = await getPool().getConnection();
        try {
            const [ result ] = await connection.query<RowDataPacket[]>(isSelectedSql.patchLeague, [ userId, leagueId ]);
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
