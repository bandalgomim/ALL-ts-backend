import { Router } from "express";
import asyncHandler from "express-async-handler";
import { uriRouter } from "./uri/uri.route";

export const matchDataRouter = Router();
matchDataRouter.use("/uri", asyncHandler(uriRouter));
