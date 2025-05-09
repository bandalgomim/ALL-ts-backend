
import { IAMDao } from "../../../models/auth/IAM/IAM.dao";
import { patchFcmTokenReqDto } from "../../../models/auth/IAM/IAM.dto";


export const fcmTokenService = {
    fcmToken: async (userId: string, body: patchFcmTokenReqDto) => {
        console.log("body in fcmTokenService: ", body);
        try {
            await IAMDao.patchFcmToken(userId, body.token);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
};
