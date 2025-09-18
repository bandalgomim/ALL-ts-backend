import { Request, Response } from "express";
import { matchService } from "./match.service";

export const matchController = {
    get: async (req: Request, res: Response) => {
        const matchId = req.query.matchId as string;
        const userId = res.locals.userId;
        if (matchId) {
            const result = await matchService.get(userId, matchId);
            res.json(result);
        }
    }
};
