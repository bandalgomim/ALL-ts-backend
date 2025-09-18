import { Request, Response } from "express";
import { IAMService } from "./IAM.service";
import { postSignUpDto, headers } from "../../../models/auth/IAM/IAM.dto";

const setHeader = (res: Response, Authorization: string, RefreshToken: string) => {
    res.setHeader("Authorization", "Bearer " + Authorization); // 액세스 토큰을 헤더에 설정
    res.setHeader("RefreshToken", RefreshToken); // 리프레시 토큰을 헤더에 설정
};

export const IAMController = {
    login: async (req: Request, res: Response) => {
        const result = await IAMService.login(res.locals.userId);
        setHeader(res, result[0], result[1]);
        try {
            res.status(200).json({ success: true, icon: res.locals.icon });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    signUp: async (req: Request, res: Response) => {
        const result = await IAMService.signUp(res.locals as postSignUpDto);
        setHeader(res, result[0], result[1]);
        try {
            res.status(200).json({ success: true, icon: res.locals.icon });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    refreshToken: async (req: Request, res: Response) => {
        const headers: headers = {
            Authorization: req.headers.authorization as string,
            RefreshToken: req.headers.refreshtoken as string
        };
        const result = await IAMService.refreshToken(headers);
        setHeader(res, result, headers.RefreshToken);
    },
    loginTest: async (req: Request, res: Response) => {
        const id = req.body.id;
        const result = await IAMService.login(id);
        setHeader(res, result[0], result[1]);
    },
    signUpTest: async (req: Request, res: Response) => {
        const result = await IAMService.signUp(req.body);
        setHeader(res, result[0], result[1]);
    }
};
