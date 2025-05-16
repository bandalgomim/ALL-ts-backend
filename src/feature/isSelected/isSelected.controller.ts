import { Request, Response } from "express";
import { isSelectedService } from "./isSelected.service";

export const isSelectedController = {
    patch: async (req: Request, res: Response) => {
        const userId = res.locals.id;
        const teamId = parseInt(req.query.teamId as string);
        const matchId = parseInt(req.query.matchId as string);
        const leagueId = parseInt(req.query.leagueId as string);
        let result;
        if (teamId && !matchId && !leagueId) {
            result = await isSelectedService.patchTeam(userId, teamId);
        } else if (matchId && !teamId && !leagueId) {
            result = await isSelectedService.patchMatch(userId, matchId);
        } else if (!matchId && !teamId && leagueId) {
            result = await isSelectedService.patchLeague(userId, leagueId);
        }
        res.json(result);
    }
};
