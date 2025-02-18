import { Request, Response } from "express";
import { snsService } from "./sns.service";

export const snsController = {
    google: async (req: Request, res: Response) => {
        const result = await snsService.google();
        res.redirect(result);
    },
    kakao: async (req: Request, res: Response) => {
        const result = await snsService.kakao();
        res.redirect(result);
    },
    naver: async (req: Request, res: Response) => {
        const result = await snsService.naver();
        res.redirect(result);
    }
};

