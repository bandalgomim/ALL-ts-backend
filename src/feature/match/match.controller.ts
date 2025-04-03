import { Request, Response } from "express";
import { matchService } from "./match.service";

export const matchController = {
    get: async (req: Request, res: Response) => {
        const matchId = parseInt(req.query.matchId as string);
        console.log("in match controller match Id: ", matchId);
        if (matchId) {
            const result = await matchService.get(matchId);
            res.json(result);
        }
    }
};
