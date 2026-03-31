import { Router } from "express";
import asyncHandler from "express-async-handler";
import { IAMController } from "@feature/IAM/IAM.controller";
import { tokenMinddleware } from "@src/utils/jwt.middleware";

export const authRouter = Router();
authRouter.post(
  "/login/google",
  asyncHandler(tokenMinddleware.googleMiddleware),
  asyncHandler(IAMController.login)
);
authRouter.post(
  "/signUp/google",
  asyncHandler(tokenMinddleware.googleMiddleware),
  asyncHandler(IAMController.signUp)
);
authRouter.post(
  "/login/apple",
  asyncHandler(tokenMinddleware.appleMiddleware),
  asyncHandler(IAMController.login)
);
authRouter.post(
  "/signUp/apple",
  asyncHandler(tokenMinddleware.appleMiddleware),
  asyncHandler(IAMController.signUp)
);
authRouter.get("/refreshToken", asyncHandler(IAMController.refreshToken));
authRouter.delete(
  "/delete",
  asyncHandler(tokenMinddleware.auth),
  asyncHandler(IAMController.delete)
);
