import { Router } from "express";
import asyncHandler from "express-async-handler";
import { uriRouter } from "@route/sync/uri/uri.route";
import { translatorRouter } from "@route/sync/translator/translator.route";

export const syncRouter = Router();
syncRouter.use("/uri", asyncHandler(uriRouter));
syncRouter.use("/translator", asyncHandler(translatorRouter));
