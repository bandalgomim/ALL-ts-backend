import { Router } from "express";
import asyncHandler from "express-async-handler";
import { fcmTokenController } from "@feature/fcm/fcmToken.controller";

export const fcmTokenRouter = Router();
fcmTokenRouter.patch("/", asyncHandler(fcmTokenController.patch));
