import { Request, Response } from "express";
import { teamService } from "./team.service";

export const teamController = {
    patch: async (req: Request, res: Response) => {
        const result = await teamService.patch(req.body);
        res.json(result);
    }
};
