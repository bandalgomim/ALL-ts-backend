import { Router } from "express";
import asyncHandler from "express-async-handler";
import { searchTagController } from "@feature/searchTag/searchTag.controller";

export const searchTagRouter = Router();
searchTagRouter.get("/", asyncHandler(searchTagController.get));
