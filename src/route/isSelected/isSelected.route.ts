import { Router } from "express";
import asyncHandler from "express-async-handler";
import { isSelectedController } from "../../feature/isSelected/isSelected.controller";

export const isSelectedRouter = Router();
isSelectedRouter.patch("/team", asyncHandler(isSelectedController.patch));
