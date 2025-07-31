import { Router } from "express";
import asyncHandler from "express-async-handler";
import { uriController } from "../../../feature/matchData/uri/uri.controller";

export const uriRouter = Router();
uriRouter.post("/", asyncHandler(uriController.post));
