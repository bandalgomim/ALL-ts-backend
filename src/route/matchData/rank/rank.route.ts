import { Router } from "express";
import asyncHandler from "express-async-handler";
import { rankController } from "../../../feature/matchData/rank/rank.controller";

export const rankRouter = Router();
rankRouter.post("/", asyncHandler(rankController.post));
