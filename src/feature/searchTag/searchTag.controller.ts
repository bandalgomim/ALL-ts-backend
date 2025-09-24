
import { Request, Response } from "express";
import { searchTagService } from "./searchTag.service";

export const searchTagController = {
    get: async (req: Request, res: Response) => {
        const result = await searchTagService.get();
        res.json(result);
    }
};
