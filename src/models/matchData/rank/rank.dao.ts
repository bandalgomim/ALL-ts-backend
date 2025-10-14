import { rankSql } from "./rank.sql";
import { getPool } from "../../../../config/db.pool";
import { ResultSetHeader } from "mysql2/promise";
import { status } from "../../../../config/response.status";
import { ApiError } from "../../../../config/error";
import { rankDto } from "./rank.dto";

export const rankDao = {
    post: async (data: rankDto[]) => {
        if (!Array.isArray(data) || data.length === 0) return;
        const connection = await getPool().getConnection();
        try {
            const params = [];
            const placeholders = data.map(() => "(?, ?, ?, ?, ?, ?, ?, ?,?, ?)").join(", ");
            for (const item of data) {
                console.log(item);
                params.push(
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
                );
            }
            await connection.beginTransaction();
            const [ res ] = await connection.query<ResultSetHeader>(rankSql.update(placeholders), params);
            await connection.commit();
            return res;
        } catch (err) {
            console.error(err);
            try { await connection.rollback(); } catch { /* empty */ }
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
            connection.release();
        }
    }
};
