import { Request, Response } from "express";
import { uriService } from "@src/feature/sync/uri/uri.service";

export const uriController = {
    post: async (req: Request, res: Response) => {
        const result = await uriService.post(req.body);
        res.json(result);
    }
};
