import { Request, Response } from "express";
import { schedulerService } from "./scheduler.service";

export const schedulerController = {
    get: async (req: Request, res: Response) => {
        const date = req.query.date as string;
        console.log(date);
        const result = await schedulerService.get(date as string);
        res.json(result);
    },
    post: async (req: Request, res: Response) => {
        const date = req.query.date as string;
        const data = req.body;
        await schedulerService.post(data, date);
        res.status(201).end();
    }
};
