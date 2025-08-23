import { Router } from "express";
import asyncHandler from "express-async-handler";
import { uriRouter } from "./uri/uri.route";
import { translatorRouter } from "./translator/translator.route";

export const matchDataRouter = Router();
matchDataRouter.use("/uri", asyncHandler(uriRouter));
matchDataRouter.use("/translator", asyncHandler(translatorRouter));
