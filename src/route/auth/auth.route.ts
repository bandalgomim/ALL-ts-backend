import { Router } from "express";
import asyncHandler from "express-async-handler";
import { IAMRouter } from "./IAM/IAM.route";

export const authRouter = Router();
authRouter.use("/IAM", asyncHandler(IAMRouter));
