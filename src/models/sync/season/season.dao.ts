import { type ResultSetHeader } from "mysql2/promise";
import { getPool } from "../../../../config/db.pool";
import { ApiError } from "../../../../config/error";
import { status } from "../../../../config/response.status";
import { type patchSeasonDto } from "./season.dto";
import { seasonSql } from "./season.sql";

export const seasonDao = {
  patch: async (req: patchSeasonDto) => {
    const connection = await getPool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.query<ResultSetHeader>(seasonSql.patchLeague, [
        req.leagueId,
        req.leagueName,
        req.leagueInitial,
        req.leagueLogo,
        req.sportId,
        req.countryId
      ]);
      await connection.query<ResultSetHeader>(seasonSql.patchSeasonState, [req.leagueId]);
      const [result] = await connection.query<ResultSetHeader>(seasonSql.patchSeason, [
        req.seasonId,
        req.leagueId,
        req.seasonName,
        req.seasonStart,
        req.seasonEnd
      ]);

      await connection.commit();
      return result.affectedRows > 0;
    } catch (err) {
      console.error(err);
      throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
    } finally {
      connection.release();
    }
  }
};
