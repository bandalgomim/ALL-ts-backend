import { RowDataPacket } from "mysql2/promise";
import { getPool } from "../../../config/db.pool";
import { ApiError } from "../../../config/error";
import { status } from "../../../config/response.status";
import { iconSql } from "./icon.sql";

export const iconDao = {
    patchIcon: async (userId: string, type: "team" | "league", id: number, icon: string) => {
        // icon 페이지의 달력과 선호팀에 들어갈 정보를 반환
        const connection = await getPool().getConnection();
        try {
            await connection.query<RowDataPacket[]>(iconSql.patchIcon, [ userId, type, id, icon ]);
            return;
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
        } finally {
        // 연결 반환 보장
            connection.release();
        }
    }
};
