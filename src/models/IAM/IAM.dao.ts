import { IAMSql } from "@models/IAM/IAM.sql";
import { getPool } from "../../../config/db.pool";
import { type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { status } from "../../../config/response.status";
import { ApiError } from "../../../config/error";
import { type postSignUpDto } from "@models/IAM/IAM.dto";

export const IAMDao = {
  postSignUp: async (body: postSignUpDto): Promise<number> => {
    const connection = await getPool().getConnection();
    try {
      const [CheckId] = await connection.query<RowDataPacket[]>(IAMSql.getLogin, [body.userId]);
      const isExistUser = CheckId[0].isExistUser;
      if (isExistUser) {
        return -1;
      }
      const [result] = await connection.query<ResultSetHeader>(IAMSql.postSignUp, [
        body.userId,
        body.name,
        body.email
      ]);
      return result.insertId;
    } catch (err) {
      console.error(err);
      throw new ApiError(status.DATA_INSERTED_SQL_ERROR);
    } finally {
      // 연결 반환 보장
      connection.release();
    }
  },
  getLogin: async (userId: string): Promise<RowDataPacket[]> => {
    const connection = await getPool().getConnection();
    try {
      const [result] = await connection.query<RowDataPacket[]>(IAMSql.getLogin, [userId]);
      const isExistUser = result[0].isExistUser;

      return isExistUser;
    } catch (err) {
      console.error(err);
      throw new ApiError(status.DATA_INSERTED_SQL_ERROR);
    } finally {
      // 연결 반환 보장
      connection.release();
    }
  },
  delete: async (userId: string): Promise<void> => {
    const connection = await getPool().getConnection();
    try {
      await connection.query(IAMSql.delete, [userId]);
    } catch (err) {
      console.error(err);
      throw new ApiError(status.DATA_DELETED_SQL_ERROR);
    } finally {
      // 연결 반환 보장
      connection.release();
    }
  }
};
