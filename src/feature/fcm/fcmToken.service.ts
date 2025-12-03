
import { patchFcmTokenReqDto } from "../../models/fcm/fcm.dto";
import { fcmDao } from "../../models/fcm/fcm.dao";


export const fcmTokenService = {
    patch: async (userId: string, body: patchFcmTokenReqDto) => {
        try {
            await fcmDao.patchFcmToken(userId, body.token);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
};
