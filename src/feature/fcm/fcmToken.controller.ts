import { type Request, type Response } from "express";
import { fcmTokenService } from "@feature/fcm/fcmToken.service";

export const fcmTokenController = {
  patch: async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    const body = req.body;
    try {
      await fcmTokenService.patch(userId, body);
      res.status(200).json(null);
    } catch (error) {
      res.status(500).json({ message: "Error updating FCM token", error });
    }
  }
};
