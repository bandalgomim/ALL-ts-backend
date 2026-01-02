import { ResultSetHeader } from "mysql2/promise";
import { getPool } from "../../../config/db.pool";
import { ApiError } from "../../../config/error";
import { status } from "../../../config/response.status";
import { patchInfoUpdateSql } from "./infoUpdate.sql";
import { infoUpdate, teamInfo } from "./infoUpdate.dto";

export const infoUpdateDao = {
    patchLeague: async (leagueId: number, leagueLogo: string) => {
        const connection = await getPool().getConnection();
        try {
            const [ result ] = await connection.query<ResultSetHeader>(
                patchInfoUpdateSql.patchLeague,
                [ leagueLogo, leagueId ]
            );
            return result.affectedRows > 0;
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
            connection.release();
        }
    },

    patchSeason: async (seasonId: number, leagueId: number, seasonName: string) => {
        const connection = await getPool().getConnection();
        try {
            const [ result ] = await connection.query<ResultSetHeader>(
                patchInfoUpdateSql.patchSeason,
                [ seasonId, leagueId, seasonName ]
            );
            return result.affectedRows > 0;
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
            connection.release();
        }
    },

    patchTeam: async (team: teamInfo) => {
        const connection = await getPool().getConnection();
        try {
            const [ result ] = await connection.query<ResultSetHeader>(
                patchInfoUpdateSql.patchTeam,
                [ team.teamId, team.teamName, team.teamInit, team.teamLogo, team.sportId, team.countryId ]
            );
            return result.affectedRows > 0;
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
            connection.release();
        }
    },

    patchAll: async (data: infoUpdate) => {
        const connection = await getPool().getConnection();
        try {
            await connection.beginTransaction();
            await connection.query<ResultSetHeader>(
                patchInfoUpdateSql.patchLeague,
                [ data.leagueLogo, data.leagueId ]
            );
            await connection.query<ResultSetHeader>(
                patchInfoUpdateSql.patchSeason,
                [ data.seasonId, data.leagueId, data.seasonName ]
            );
            for (const team of data.teamInfo) {
                await connection.query<ResultSetHeader>(
                    patchInfoUpdateSql.patchTeam,
                    [ team.teamId, team.teamName, team.teamInit, team.teamLogo, 1, 1 ]
                );
            }

            await connection.commit();
            return true;
        } catch (err) {
            await connection.rollback();
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
            connection.release();
        }
    }
};
