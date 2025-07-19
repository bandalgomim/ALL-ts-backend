import { Router } from "express";
import asyncHandler from "express-async-handler";
import { iconController } from "../../feature/icon/icon.controller";

export const iconRouter = Router();
iconRouter.patch("/", asyncHandler(iconController.patch));
iconRouter.delete("/", asyncHandler(iconController.delete));
