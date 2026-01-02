import { Request, Response } from "express";
import { versionCheckService } from "@feature/versionCheck/versionCheck.service";

export const versionCheckController = {
    post: async (req: Request, res: Response) => {
        const version = req.body;
        const result = await versionCheckService.post(version);
        res.json(result);
    }
};
