import { Request, Response } from "express";
import { rankService } from "@feature/matchData/rank/rank.service";

export const rankController = {
    post: async (req: Request, res: Response) => {
        const result = await rankService.post(req.body);
        res.json(result);
    }
};

