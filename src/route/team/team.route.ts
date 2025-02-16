import { Router } from "express";
import asyncHandler from "express-async-handler";
import { teamController } from "../../feature/team/team.controller";

export const teamRouter = Router();
teamRouter.get("/", asyncHandler(teamController.get));

