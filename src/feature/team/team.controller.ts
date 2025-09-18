import { Request, Response } from "express";
import { teamService } from "./team.service";

export const teamController = {
    get: async (req: Request, res: Response) => {
        const teamId = parseInt(req.query.teamId as string);
        const userId = res.locals.userId;
        if (teamId) {
            const result = await teamService.get(userId, teamId);
            res.json(result);
        }
    }
};
