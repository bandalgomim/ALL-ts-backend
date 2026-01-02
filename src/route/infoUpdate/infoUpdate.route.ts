import { Router } from "express";
import asyncHandler from "express-async-handler";
import { infoUpdateController } from "../../feature/infoUpdate/infoUpdate.controller";

export const infoUpdateRouter = Router();

infoUpdateRouter.patch("/", asyncHandler(infoUpdateController.patchAll));
