import { Request, Response } from "express";
import { leagueService } from "./league.service";

export const leagueController = {
    get: async (req: Request, res: Response) => {
        const leagueId = parseInt(req.query.leagueId as string);
        const result = await leagueService.get(leagueId);
        res.json(result);
    }
};
