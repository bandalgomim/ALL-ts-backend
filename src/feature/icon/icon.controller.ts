import { Request, Response } from "express";
import { iconService } from "./icon.service";

export const iconController = {
    patch: async (req: Request, res: Response) => {
        const userId = res.locals.id;
        console.log("iconController.patch", req.body);
        const type = req.body.type as "team" | "league";
        const id = parseInt(req.body.id as string);
        const icon = req.body.icon as string;
        const result = await iconService.patchIcon(userId, type as "team" | "league", id, icon);
        res.json(result);
    }
};
