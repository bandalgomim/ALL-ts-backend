import { Router } from "express";
import asyncHandler from "express-async-handler";
import { seasonController } from "@src/feature/sync/season/season.controller";
import { teamController } from "@src/feature/sync/team/team.controller";

export const syncRouter = Router();

syncRouter.patch("/season", asyncHandler(seasonController.patch));
syncRouter.patch("/team", asyncHandler(teamController.patch));
