import { type Request, type Response } from "express";
import { isSelectedService } from "@feature/isSelected/isSelected.service";

export const isSelectedController = {
  patch: async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    const teamId = req.query.teamId as string;
    const matchId = req.query.matchId as string;
    const leagueId = req.query.leagueId as string;
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
