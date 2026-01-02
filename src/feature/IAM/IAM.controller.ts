/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { IAMService } from "./IAM.service";
import { postSignUpDto, headers } from "../../models/IAM/IAM.dto";

const setHeader = (res: Response, Authorization: string, RefreshToken: string) => {
    res.setHeader("Authorization", "Bearer " + Authorization); // 액세스 토큰을 헤더에 설정
    res.setHeader("RefreshToken", RefreshToken); // 리프레시 토큰을 헤더에 설정
};

export const IAMController = {
    login: async (req: Request, res: Response) => {
        console.log("IAMController.login called");
        const result = await IAMService.login(res.locals.userId);
        if (result[0] === true) {
            setHeader(res, result[1] as string, result[2] as string);
        }
        try {
            res.status(200).json({ success: result[0], icon: res.locals.icon });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    },
    signUp: async (req: Request, res: Response) => {
        const result = await IAMService.signUp(res.locals as postSignUpDto);
        if (result[0] === true) {
            setHeader(res, result[1] as string, result[2] as string);
        }
        try {
            res.status(200).json({ success: result[0], icon: res.locals.icon });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    },
    refreshToken: async (req: Request, res: Response) => {
        const headers: headers = {
            Authorization: req.headers.authorization as string,
            RefreshToken: req.headers.refreshtoken as string
        };
        const result = await IAMService.refreshToken(headers);
        setHeader(res, result, headers.RefreshToken);
        try {
            res.status(200).json();
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    },
    delete: async (req: Request, res: Response) => {
        const userId = res.locals.userId;
        try {
            await IAMService.delete(userId);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(200).json({ success: false });
        }
    }
};
