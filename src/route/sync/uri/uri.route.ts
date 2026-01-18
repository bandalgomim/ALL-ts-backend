import { Router } from "express";
import asyncHandler from "express-async-handler";
import { uriController } from "@src/feature/sync/uri/uri.controller";

export const uriRouter = Router();
uriRouter.post("/", asyncHandler(uriController.post));
