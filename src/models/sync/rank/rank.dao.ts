import { rankSql } from "./rank.sql";
import { getPool } from "../../../../config/db.pool";
import { type ResultSetHeader } from "mysql2/promise";
import { status } from "../../../../config/response.status";
import { ApiError } from "../../../../config/error";
import { type patchRankDto } from "@models/sync/rank/rank.dto";

export const rankDao = {
  patch: async (data: patchRankDto[]) => {
    if (!Array.isArray(data) || data.length === 0) return;
    const connection = await getPool().getConnection();
    try {
      const rows = data.map((item) => [
        item.seasonId,
        item.leagueId,
        item.teamId,
        item.win,
        item.draw,
        item.lose,
        item.point,
        item.rank,
        item.section,
        item.sectionIdx
      ]);

      await connection.beginTransaction();
      const [res] = await connection.query<ResultSetHeader>(rankSql.patch, [rows]);
      await connection.commit();
      return res;
    } catch (err) {
      console.error(err);
      try {
        await connection.rollback();
      } catch {
        /* empty */
      }
      throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
    } finally {
      connection.release();
    }
  }
};
