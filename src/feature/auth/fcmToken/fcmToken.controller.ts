import { Request, Response } from "express";
import { fcmTokenService } from "./fcmToken.service";


export const fcmTokenController = {
    fcmToken: async (req: Request, res: Response) => {
        console.log("body in patchFcmToken: ", req.body);
        const userId = res.locals.id;
        const body = req.body;
        try {
            await fcmTokenService.fcmToken(userId, body);
            res.status(200).json(null);
        } catch (error) {
            res.status(500).json({ message: "Error updating FCM token", error });
        }
    }
};
