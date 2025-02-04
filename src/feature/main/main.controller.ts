import { Request, Response } from "express";
import { mainService } from "./main.service";

export const mainController = {
    get: async (req: Request, res: Response) => {
        const userId = res.locals.id;
        const result = await mainService.get(userId);
        res.json(result);
    },
    deleteMatch: async (req: Request, res: Response) => {
        const userId = res.locals.id;
        const matchId = parseInt(req.query.matchId as string);
        const result = await mainService.deleteMatch(userId, matchId);
        res.json(result);
    }
};
