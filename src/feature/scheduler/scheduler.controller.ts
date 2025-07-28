import { Request, Response } from "express";
import { schedulerService } from "./scheduler.service";

export const schedulerController = {
    get: async (req: Request, res: Response) => {
        const date = req.body.date as string;
        const result = await schedulerService.get(date as string);
        res.json(result);
    }
};
