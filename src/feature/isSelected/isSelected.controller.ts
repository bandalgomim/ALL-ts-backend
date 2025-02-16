import { Request, Response } from "express";
import { isSelectedService } from "./isSelected.service";

export const isSelectedController = {
    patch: async (req: Request, res: Response) => {
        const userId = res.locals.id;
        const teamId = parseInt(req.query.teamId as string);
        const matchId = parseInt(req.query.matchId as string);
        let result;

        if (teamId && !matchId) {
            result = await isSelectedService.patchTeam(userId, teamId);
        } else if (matchId && !teamId) {
            result = await isSelectedService.patchMatch(userId, matchId);
        }
        res.json(result);
    }
};
