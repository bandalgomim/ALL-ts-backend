import { Router } from "express";
import asyncHandler from "express-async-handler";
import { fcmTokenController } from "../../feature/auth/fcmToken/fcmToken.controller";

export const fcmTokenRouter = Router();
fcmTokenRouter.patch("/", asyncHandler(fcmTokenController.fcmToken));


