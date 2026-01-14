import { Router } from "express";
import asyncHandler from "express-async-handler";
import { uriRouter } from "@route/matchData/uri/uri.route";
import { translatorRouter } from "@route/matchData/translator/translator.route";

export const matchDataRouter = Router();
matchDataRouter.use("/uri", asyncHandler(uriRouter));
matchDataRouter.use("/translator", asyncHandler(translatorRouter));
