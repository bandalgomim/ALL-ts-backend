import { type ResultSetHeader } from "mysql2/promise";
import { getPool } from "../../../../config/db.pool";
import { ApiError } from "../../../../config/error";
import { status } from "../../../../config/response.status";
import { type patchTeamDto } from "./team.dto";
import { teamSql } from "./team.sql";

export const teamDao = {
  patch: async (req: patchTeamDto[]) => {
    if (!req || req.length === 0) return false; // ✅ empty 방어
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

      const [result] = await connection.query<ResultSetHeader>(teamSql.patch, [values]);
      return result.affectedRows > 0;
    } catch (err) {
      console.error(err);
      throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
    } finally {
      connection.release();
    }
  }
};
