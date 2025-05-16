import { Router } from "express";
import asyncHandler from "express-async-handler";
import { fcmTokenController } from "../../fcmToken/fcmToken.controller";

export const fcmTokenRouter = Router();
fcmTokenRouter.patch("/", asyncHandler(fcmTokenController.patch));


