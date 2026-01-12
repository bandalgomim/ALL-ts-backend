import { Request, Response } from "express";
import { seasonService } from "./season.service";

export const seasonController = {
    patch: async (req: Request, res: Response) => {
        const result = await seasonService.patch(req.body);
        res.json(result);
    }
};
