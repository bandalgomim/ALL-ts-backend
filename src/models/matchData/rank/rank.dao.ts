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
            await connection.beginTransaction();

            const { sql, params } = rankSql.updateBulk(data);
            console.log(sql, params);
            const [ res ] = await connection.query<ResultSetHeader>(sql, params);

            await connection.commit();
            return {
                affectedRows: res.affectedRows,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                changedRows: (res as any).changedRows ?? undefined // mysql2 타입 보완
            };
        } catch (err) {
            console.error(err);
            try { await connection.rollback(); } catch { /* empty */ }
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
            connection.release();
        }
    }
};
