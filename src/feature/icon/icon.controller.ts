import { Request, Response } from "express";
import { iconService } from "./icon.service";

export const iconController = {
    patch: async (req: Request, res: Response) => {
        const userId = res.locals.id;
        const type = req.query.type as string;
        const Id = parseInt(req.query.matchId as string);
        const uri = req.query.leagueId as string;
        const result = await iconService.patchIcon(userId, type, Id, uri);
        res.json(result);
    }
};
