import { Router } from "express";
import asyncHandler from "express-async-handler";
import { IAMController } from "../../../feature/auth/IAM/IAM.controller";

export const IAMRouter = Router();
IAMRouter.get("/login", asyncHandler(IAMController.login));
IAMRouter.post("/signUp", asyncHandler(IAMController.signUp));
IAMRouter.get("/refreshToken", asyncHandler(IAMController.refreshToken));
IAMRouter.post("/loginTest", asyncHandler(IAMController.loginTest));
