import { Router } from "express";
import asyncHandler from "express-async-handler";
import { uriRouter } from "@route/matchData/uri/uri.route";
import { translatorRouter } from "@route/matchData/translator/translator.route";
import { rankRouter } from "@route/matchData/rank/rank.route";

export const matchDataRouter = Router();
matchDataRouter.use("/uri", asyncHandler(uriRouter));
matchDataRouter.use("/rank", asyncHandler(rankRouter));
matchDataRouter.use("/translator", asyncHandler(translatorRouter));
