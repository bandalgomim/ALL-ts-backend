import { IAMSql } from "./IAM.sql";
import { getPool }  from "./../../../../config/db.pool";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { status } from "../../../../config/response.status";
import { ApiError } from "../../../../config/error";
import { postSignUpDto } from "./IAM.dto";

export const IAMDao = {
    postSignUp: async (body: postSignUpDto): Promise<number> => {
        const connection = await getPool().getConnection();
        try {
            const [ CheckEamil ] = await connection.query<RowDataPacket[]>(IAMSql.getEmail, [ body.email ]);
            const isEmailExist = CheckEamil[0].isExistEmail;
            if (isEmailExist) {
                return -1;
            }
            const [ result ] = await connection.query<ResultSetHeader>(IAMSql.postSignUp,
                [ body.userId, body.email, body.nickname, body.icon ]);
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
            const [ result ] = await connection.query<RowDataPacket[]>(IAMSql.getLogin, [ userId ]);
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
    patchFcmToken: async (userId: string, token: string): Promise<void> => {
        const connection = await getPool().getConnection();
        try {
            await connection.query<RowDataPacket[]>(IAMSql.patchFcmToken, [ token, userId ]);
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_INSERTED_SQL_ERROR);
        } finally {
        // 연결 반환 보장
            connection.release();
        }
    }
};
