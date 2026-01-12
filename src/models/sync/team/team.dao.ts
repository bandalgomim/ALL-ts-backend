import { ResultSetHeader } from "mysql2/promise";
import { getPool } from "../../../../config/db.pool";
import { ApiError } from "../../../../config/error";
import { status } from "../../../../config/response.status";
import { patchInfoUpdateSql } from "@models/infoUpdate/infoUpdate.sql";
import { patchTeamDto } from "./team.dto";

export const teamDao = {
    patch: async (req: patchTeamDto[]) => {
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
