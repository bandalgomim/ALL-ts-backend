import { Request, Response } from "express";
import { translatorService } from "./translator.service";
export const translatorController = {
    post: async (req: Request, res: Response) => {
        const result = await translatorService.post(req.body);
        res.json(result);
    }
};
