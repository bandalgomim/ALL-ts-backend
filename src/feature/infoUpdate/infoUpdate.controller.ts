import { Request, Response } from "express";
import { infoUpdateService } from "./infoUpdate.service";
import { infoUpdate, teamInfo } from "../../models/infoUpdate/infoUpdate.dto";

export const infoUpdateController = {
    patchLeague: async (req: Request, res: Response) => {
        const { leagueId, leagueLogo } = req.body;
        const result = await infoUpdateService.patchLeague(leagueId, leagueLogo);
        res.json(result);
    },

    patchSeason: async (req: Request, res: Response) => {
        const { seasonId, leagueId, seasonName } = req.body;
        const result = await infoUpdateService.patchSeason(seasonId, leagueId, seasonName);
        res.json(result);
    },

    patchTeam: async (req: Request, res: Response) => {
        const team: teamInfo = req.body;
        const result = await infoUpdateService.patchTeam(team);
        res.json(result);
    },

    patchAll: async (req: Request, res: Response) => {
        const data: infoUpdate = req.body;
        console.log(data);
        const result = await infoUpdateService.patchAll(data);
        res.json(result);
    }
};
