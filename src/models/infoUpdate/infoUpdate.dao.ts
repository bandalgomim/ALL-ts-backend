import { ResultSetHeader } from "mysql2/promise";
import { getPool } from "../../../config/db.pool";
import { ApiError } from "../../../config/error";
import { status } from "../../../config/response.status";
import { patchInfoUpdateSql } from "@models/infoUpdate/infoUpdate.sql";
import { infoUpdateSeason, infoUpdateTeam } from "@models/infoUpdate/infoUpdate.dto";

export const infoUpdateDao = {
    patchSeason: async (req: infoUpdateSeason) => {
        const connection = await getPool().getConnection();
        try {
            await connection.beginTransaction();
            await connection.query<ResultSetHeader>(
                patchInfoUpdateSql.patchLeague,
                [ req.leagueId, req.leagueName, req.leagueInitial, req.leagueLogo, req.sportId, req.countryId ]
            );
            await connection.query<ResultSetHeader>(
                patchInfoUpdateSql.patchSeasonState,
                [ req.leagueId ]
            );
            const [ result ] = await connection.query<ResultSetHeader>(
                patchInfoUpdateSql.patchSeason,
                [ req.seasonId, req.leagueId, req.seasonName, req.seasonStart, req.seasonEnd ]
            );

            await connection.commit();
            return result.affectedRows > 0;
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
            connection.release();
        }
    },
    patchTeam: async (req: infoUpdateTeam[]) => {
        const connection = await getPool().getConnection();
        try {
            const values = req.map((team) => [
                team.teamId,
                team.teamName,
                team.teamInitial,
                team.teamLogo,
                team.sportId,
                team.countryId
            ]);

            const [ result ] = await connection.query<ResultSetHeader>(
                patchInfoUpdateSql.patchTeamBatch,
                [ values ]
            );
            return result.affectedRows > 0;
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
            connection.release();
        }
    }
};
