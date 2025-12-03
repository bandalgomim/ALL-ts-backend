import { Router } from "express";
import asyncHandler from "express-async-handler";
import { IAMController } from "../../feature/IAM/IAM.controller";
import { tokenMinddleware } from "../../utils/jwt.middleware";

export const authRouter = Router();
authRouter.post("IAM/login/google", asyncHandler(tokenMinddleware.googleMiddleware), asyncHandler(IAMController.login));
authRouter.post("IAM/signUp/google", asyncHandler(tokenMinddleware.googleMiddleware), asyncHandler(IAMController.signUp));
authRouter.post("IAM/login/apple", asyncHandler(tokenMinddleware.appleMiddleware), asyncHandler(IAMController.login));
authRouter.post("IAM/signUp/apple", asyncHandler(tokenMinddleware.appleMiddleware), asyncHandler(IAMController.signUp));
authRouter.get("IAM/refreshToken", asyncHandler(IAMController.refreshToken));
authRouter.delete("IAM/delete", asyncHandler(tokenMinddleware.auth), asyncHandler(IAMController.delete));
