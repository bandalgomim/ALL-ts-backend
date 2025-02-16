import { Request, Response } from "express";
import { teamService } from "./team.service";

export const teamController = {
    get: async (req: Request, res: Response) => {
        const matchId = parseInt(req.query.matchId as string);
        const result = await teamService.get(matchId);
        res.json(result);
    }
};
