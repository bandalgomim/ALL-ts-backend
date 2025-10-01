import { Router } from "express";
import asyncHandler from "express-async-handler";
import { schedulerController } from "../../feature/scheduler/scheduler.controller";

export const schedulerRouter = Router();
schedulerRouter.get("/", asyncHandler(schedulerController.get));
schedulerRouter.post("/", asyncHandler(schedulerController.post));
schedulerRouter.post("/batch", asyncHandler(schedulerController.batch));
