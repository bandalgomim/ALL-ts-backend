import { Router } from "express";
import asyncHandler from "express-async-handler";
import { leagueController } from "../../feature/league/league.controller";

export const leagueRouter = Router();
leagueRouter.get("/", asyncHandler(leagueController.get));
