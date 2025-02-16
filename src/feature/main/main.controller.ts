import { Request, Response } from "express";
import { mainService } from "./main.service";

export const mainController = {
    get: async (req: Request, res: Response) => {
        const userId = res.locals.id;
        const result = await mainService.get(userId);
        res.json(result);
    }
};
