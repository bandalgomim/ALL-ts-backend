import { matchSql } from "./match.sql";
import { getPool } from "../../../../config/db.pool";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { status } from "../../../../config/response.status";
import { ApiError } from "../../../../config/error";
import { patchMatchDto } from "./match.dto";

export const matchDao = {
    get: async (date: string): Promise<RowDataPacket[]> => {
        const connection = await getPool().getConnection();
        try {
            const [ rows ] = await connection.query<RowDataPacket[]>(matchSql.get, [ date ]);
            return rows; // 쿼리 결과 반환 추가
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
            // 연결 반환 보장
            connection.release();
        }
    },
    patch: async (data: patchMatchDto[]) => {
        if (!Array.isArray(data) || data.length === 0) return false;

        const connection = await getPool().getConnection();
        try {
            // VALUES ?에 넣을 2차원 배열 생성
            const rows = data.map((item) => ([
                item.matchId, // match_id
                item.leagueId,
                item.homeTeamId ? item.homeTeamId : "TBD",
                item.awayTeamId ? item.awayTeamId : "TBD",
                item.date,
                item.status,
                item.homeTeamScore ? item.homeTeamScore : 0,
                item.awayTeamScore ? item.awayTeamScore : 0,
                item.doubleHeader,
                item.seasonId
            ]));

            await connection.beginTransaction();
            await connection.query<ResultSetHeader>(matchSql.patch, [ rows ]);
            await connection.commit();
            return true;
        } catch (err) {
            console.error(err);
            try { await connection.rollback(); } catch { /* empty */ }
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
            connection.release();
        }
    },
    patchMatchList: async (data: patchMatchDto[]): Promise<number> => {
        if (!Array.isArray(data) || data.length === 0) return 0;

        const connection = await getPool().getConnection();
        try {
            const matchListRows = data.map((item) => ([
                item.matchId,
                item.homeTeamId ? item.homeTeamId : "TBD",
                item.awayTeamId ? item.awayTeamId : "TBD",
            ]));

            await connection.beginTransaction();

            await connection.query(matchSql.patchMatchList.createTmpNewMatches);
            await connection.query(matchSql.patchMatchList.truncateTmpNewMatches);
            await connection.query(matchSql.patchMatchList.insertTmpNewMatches, [matchListRows]);

            const [result] = await connection.query<ResultSetHeader>(
                matchSql.patchMatchList.insertMatchListFromTmp
            );

            await connection.commit();
            return result.affectedRows ?? 0;
        } catch (err) {
            console.error(err);
            try { await connection.rollback(); } catch { /* empty */ }
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
            connection.release();
        }
    },
};
