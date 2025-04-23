import { Router } from "express";
import asyncHandler from "express-async-handler";
import { IAMRouter } from "./IAM/IAM.route";
import { snsRouter } from "./sns/sns.route";

export const authRouter = Router();
authRouter.use("/IAM", asyncHandler(IAMRouter));
authRouter.use("/sns", asyncHandler(snsRouter));