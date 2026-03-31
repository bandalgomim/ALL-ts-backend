import { iconSql } from "@models/icon/icon.sql";
import { getPool } from "../../../config/db.pool";
import { type RowDataPacket } from "mysql2/promise";
import { status } from "../../../config/response.status";
import { ApiError } from "../../../config/error";

export const iconDao = {
  patchIcon: async (userId: string, type: string, id: string, uri: string): Promise<void> => {
    const connection = await getPool().getConnection();
    try {
      await connection.query<RowDataPacket[]>(iconSql.patchIcon, [userId, type, id, uri]);
    } catch (err) {
      console.error(err);
      throw new ApiError(status.DATA_INSERTED_SQL_ERROR);
    } finally {
      // 연결 반환 보장
      connection.release();
    }
  }
};
