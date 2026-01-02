import { Router } from "express";
import asyncHandler from "express-async-handler";
import { translatorController } from "@feature/matchData/translator/translator.controller";

export const translatorRouter = Router();
translatorRouter.post("/", asyncHandler(translatorController.post));
