import { fcmSql } from "./fcm.sql";
import { getPool } from "../../../config/db.pool";
import { RowDataPacket } from "mysql2/promise";
import { status } from "../../../config/response.status";
import { ApiError } from "../../../config/error";

export const fcmDao = {
    patchFcmToken: async (userId: string, token: string): Promise<void> => {
        const connection = await getPool().getConnection();
        try {
            await connection.query<RowDataPacket[]>(fcmSql.patchFcmToken, [ token, userId ]);
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_INSERTED_SQL_ERROR);
        } finally {
        // 연결 반환 보장
            connection.release();
        }
    },
    get: async (matchId: string) => {
        const connection = await getPool().getConnection();
        try {
            const [ rows ] = await connection.query<RowDataPacket[]>(fcmSql.get, [ matchId ]);
            return rows;
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_INSERTED_SQL_ERROR);
        } finally {
        // 연결 반환 보장
            connection.release();
        }
    },
    getLive: async (matchId: string) => {
        const connection = await getPool().getConnection();
        try {
            const [ rows ] = await connection.query<RowDataPacket[]>(fcmSql.getLive, [ matchId ]);
            return rows;
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_INSERTED_SQL_ERROR);
        } finally {
        // 연결 반환 보장
            connection.release();
        }
    },
    postLiveAlarm: async (matchId: string): Promise<void> => {
        const connection = await getPool().getConnection();
        try {
            await connection.query<RowDataPacket[]>(fcmSql.postLiveAlarm, [ matchId ]);
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_INSERTED_SQL_ERROR);
        } finally {
        // 연결 반환 보장
            connection.release();
        }
    },
    getFcmToken: async (matchId: string) => {
        const connection = await getPool().getConnection();
        try {
            const [ rows ] = await connection.query<RowDataPacket[]>(fcmSql.getFcmToken, [ matchId ]);
            return rows.map((row) => Object.values(row)[0]);
        } catch (err) {
            console.error(err);
            throw new ApiError(status.DATA_INSERTED_SQL_ERROR);
        } finally {
        // 연결 반환 보장
            connection.release();
        }
    }

};
