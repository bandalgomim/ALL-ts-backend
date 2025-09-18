import { Router } from "express";
import asyncHandler from "express-async-handler";
import { IAMController } from "../../../feature/auth/IAM/IAM.controller";
import { tokenMinddleware } from "../../../utils/jwt.middleware";

export const IAMRouter = Router();
IAMRouter.post("/login/google", asyncHandler(tokenMinddleware.googleMiddleware), asyncHandler(IAMController.login));
IAMRouter.post("/signUp/google", asyncHandler(tokenMinddleware.googleMiddleware), asyncHandler(IAMController.signUp));
IAMRouter.post("/signUpTest", asyncHandler(IAMController.signUpTest));
IAMRouter.get("/refreshToken", asyncHandler(IAMController.refreshToken));
IAMRouter.post("/loginTest", asyncHandler(IAMController.loginTest));
