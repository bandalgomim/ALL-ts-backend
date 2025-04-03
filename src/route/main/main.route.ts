import { Router } from "express";
import asyncHandler from "express-async-handler";
import { mainController } from "../../feature/main/main.controller";

export const mainRouter = Router();
mainRouter.get("/", asyncHandler(mainController.get));
mainRouter.patch("/", asyncHandler(mainController.patch));


