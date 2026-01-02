import { Router } from "express";
import asyncHandler from "express-async-handler";
import { versionCheckController } from "@feature/versionCheck/versionCheck.controller";
export const versionCheckRouter = Router();
versionCheckRouter.post("/", asyncHandler(versionCheckController.post));
