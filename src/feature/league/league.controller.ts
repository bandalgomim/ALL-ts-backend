import { Request, Response } from "express";
import { leagueService } from "@feature/league/league.service";

export const leagueController = {
    get: async (req: Request, res: Response) => {
        const userId = res.locals.userId;
        const leagueId = parseInt(req.query.leagueId as string);
        if (leagueId) {
            const result = await leagueService.get(userId, leagueId);
            res.json(result);
        }
    }
};
