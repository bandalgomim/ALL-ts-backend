import { Request, Response } from "express";
import { uriService } from "@feature/matchData/uri/uri.service";

export const uriController = {
    post: async (req: Request, res: Response) => {
        const date = req.query.date as string;
        const result = await uriService.post(req.body, date);
        res.json(result);
    }
};
