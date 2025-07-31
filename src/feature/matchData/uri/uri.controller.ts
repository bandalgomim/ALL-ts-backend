import { Request, Response } from "express";
import { uriService } from "./uri.service";

export const uriController = {
    post: async (req: Request, res: Response) => {
        const date = req.query.date as string;
        const result = await uriService.post(req.body, date);
        console.log(date, result);
        res.json(result);
    }
};
