import { Request, Response } from "express";
import { IAMService } from "./IAM.service";
import { postSignUpDto, headers } from "../../../models/auth/IAM/IAM.dto";

const setHeader = (res: Response, Authorization: string, RefreshToken: string, userId: string) => {
    res.setHeader("Authorization", "Bearer " + Authorization); // 액세스 토큰을 헤더에 설정
    res.setHeader("RefreshToken", RefreshToken); // 리프레시 토큰을 헤더에 설정
    res.setHeader("userId", userId); //
    res.send("Tokens sent in headers");
};

export const IAMController = {
    login: async (req: Request, res: Response) => {
        const result = await IAMService.login(res.locals.id);
        setHeader(res, result[0], result[1], res.locals.id);
    },
    signUp: async (req: Request, res: Response) => {
        const result = await IAMService.signUp(res.locals as postSignUpDto);
        setHeader(res, result[0], result[1], res.locals.id);
    },
    refreshToken: async (req: Request, res: Response) => {
        const headers: headers = {
            Authorization: req.headers.authorization as string,
            RefreshToken: req.headers.refreshtoken as string
        };
        const result = await IAMService.refreshToken(headers);
        setHeader(res, result, headers.RefreshToken, res.locals.id);
    },
    loginTest: async (req: Request, res: Response) => {
        const id = req.body.id;
        const result = await IAMService.login(id);
        setHeader(res, result[0], result[1], id);
    }
};
