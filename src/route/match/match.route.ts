import { Router } from "express";
import asyncHandler from "express-async-handler";
import { matchController } from "../../feature/match/match.controller";

export const matchRouter = Router();
matchRouter.get("/", asyncHandler(matchController.get));
