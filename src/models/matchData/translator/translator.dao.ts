import { translatorSql } from "./translator.sql";
import { getPool } from "../../../../config/db.pool";
import { ResultSetHeader } from "mysql2/promise";
import { status } from "../../../../config/response.status";
import { ApiError } from "../../../../config/error";
import { translatorDto } from "./translator.dto";

export const translatorDao = {
    post: async (data: translatorDto[]) => {
        if (!Array.isArray(data) || data.length === 0) return;
        const connection = await getPool().getConnection();
        try {
            const params = [];
            const placeholders = data.map(() => "(?, ?, ?, ?)").join(", ");
            for (const item of data) {
                params.push(
                    `${item.date.split(" ")[0]}-${item.homeTeamId}-${item.awayTeamId}-${item.doubleHeader}`,
                    item.platformId,
                    item.type,
                    item.url
                );
            }
            await connection.beginTransaction();
            await connection.query<ResultSetHeader>(translatorSql.post(placeholders), params);
            await connection.commit();
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
            // 연결 반환 보장
            connection.release();
        }
    }
};
