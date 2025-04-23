import { Router } from "express";
import asyncHandler from "express-async-handler";
import { snsController } from "../../../feature/auth/sns/sns.controller";

export const snsRouter = Router();
snsRouter.get("/naver", asyncHandler(snsController.naver));

