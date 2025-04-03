import { Request, Response } from "express";
import { teamService } from "./team.service";

export const teamController = {
    get: async (req: Request, res: Response) => {
        const teamId = parseInt(req.query.teamId as string);
        const userId = res.locals.id;
        console.log("in team controller team Id: ", teamId);
        if (teamId) {
            const result = await teamService.get(userId, teamId);
            res.json(result);
        }
    }
};
