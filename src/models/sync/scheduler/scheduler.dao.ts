import { schedulerSql } from "@models/sync/scheduler/scheduler.sql";
import { getPool } from "../../../../config/db.pool";
import { type RowDataPacket } from "mysql2/promise";
import { status } from "../../../../config/response.status";
import { ApiError } from "../../../../config/error";

export const schedulerDao = {
  get: async (): Promise<RowDataPacket[]> => {
    const connection = await getPool().getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(schedulerSql.get, []);
      return rows; // 쿼리 결과 반환 추가
    } catch (err) {
      console.error(err);
      throw new ApiError(status.DATA_SEARCH_SQL_ERROR);
    } finally {
      // 연결 반환 보장
      connection.release();
    }
  }
};
