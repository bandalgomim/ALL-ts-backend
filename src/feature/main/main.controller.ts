import { Request, Response } from "express";
import { mainService } from "./main.service";

export const mainController = {
    get: async (req: Request, res: Response) => {
        const userId = res.locals.userId;
        const result = await mainService.get(userId);
        res.json(result);
    },
    patch: async (req: Request, res: Response) => {
        const userId = res.locals.userId;
        const index = req.body;
        const result = await mainService.patch(userId, index);
        res.json(result);
    }
};
