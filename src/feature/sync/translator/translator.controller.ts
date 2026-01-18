import { Request, Response } from "express";
import { translatorService } from "@src/feature/sync/translator/translator.service";
export const translatorController = {
    post: async (req: Request, res: Response) => {
        console.log(req.body)
        const result = await translatorService.post(req.body);
        res.json(result);
    }
};
