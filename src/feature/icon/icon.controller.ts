import { Request, Response } from "express";
import { iconService } from "./icon.service";

export const iconController = {
    patch: async (req: Request, res: Response) => {
        const userId = res.locals.id;
        const type = req.body.type as string;
        const id = parseInt(req.body.id as string);
        const uri = req.body.uri as string;
        const result = await iconService.patchIcon(userId, type, id, uri);
        res.json(result);
    }
};
