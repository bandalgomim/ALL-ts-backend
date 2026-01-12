import { Request, Response } from "express";
import { infoUpdateService } from "@feature/infoUpdate/infoUpdate.service";

export const infoUpdateController = {
    patchSeason: async (req: Request, res: Response) => {
        const result = await infoUpdateService.patchSeason(req.body);
        res.json(result);
    },
    patchTeam: async (req: Request, res: Response) => {
        const result = await infoUpdateService.patchTeam(req.body);
        res.json(result);
    }
};
