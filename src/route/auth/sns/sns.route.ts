import { Router } from "express";
import asyncHandler from "express-async-handler";
import { snsController } from "../../../feature/auth/sns/sns.controller";

export const authRouter = Router();
authRouter.get("/sns/naver", asyncHandler(snsController.naver));
