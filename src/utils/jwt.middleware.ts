import { tokenUtils } from "./jwt.utils";
import { Request, Response, NextFunction } from "express";
import { status } from "../../config/response.status";
import { config } from "dotenv";
import axios from "axios";
import { ApiError } from "../../config/error";
import { IAMController } from "../feature/auth/IAM/IAM.controller";

config();

export const tokenMinddleware = {
    auth: async  (req: Request, res: Response, next: NextFunction) => {
        if (req.headers.authorization) {
            const accessToken = req.headers.authorization as string;
            const token = accessToken.split(" ")[1];
            const result = tokenUtils.verify(token); // token을 검증합니다.
            if (result.ok) {
                res.locals.id = result.sub;
                next();
            } else {
                await IAMController.refreshToken(req, res);
            }
        } else {
            throw new ApiError(status.THERE_IS_NO_ACCESS_TOKEN);
        }
    },
    google: async (req: Request, res: Response, next: NextFunction) => {

        const urlPath = req.originalUrl;  // 쿼리스트링을 제외한 경로만 가져옵니다.
        const signUpRegex = /\/signUp\//;
        let redirectUri = null;

        if (signUpRegex.test(urlPath)) {
            redirectUri = process.env.GOOGLE_REDIRECT_URI_SIGN_UP;
        } else {
            redirectUri = process.env.GOOGLE_REDIRECT_URI_LOGIN;
        }
        const { code } = req.query;
        console.log(code);
        const token = await axios.post(process.env.GOOGLE_TOKEN_URL as string, {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: redirectUri,
            grant_type: "authorization_code"
        });
        const userInfo = await axios.get(process.env.GOOGLE_USERINFO_URL as string, {
            headers: {
                Authorization: "Bearer " + token.data.access_token
            }
        });
        res.locals = {
            id: "google" + userInfo.data.id,
            email: userInfo.data.email,
            name: userInfo.data.name,
            icon: userInfo.data.picture
        };
        next();
    },
    naver: async (req: Request, res: Response, next: NextFunction) => {
        const path = req.path;
        let redirectUri = null;
        if (path === "/signUp/naver") {
            redirectUri = process.env.NAVER_REDIRECT_URI_SIGN_UP;
        } else {
            redirectUri = process.env.NAVER_REDIRECT_URI_LOGIN;
        }
        const code = req.query.code;
        const state = req.query.state;

        const data = {
            grant_type: "authorization_code",
            response_type: "code",
            client_id: process.env.NAVER_CLIENT_ID as string,
            client_secret: process.env.NAVER_CLIENT_SECRET as string,
            redirect_uri: redirectUri as string,
            code: code as string,
            state: state as string
        };

        const naverToken = await axios.post(
            process.env.NAVER_TOKEN_URL as string,
            data,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        const header = {
            Authorization: "Bearer " + naverToken.data.access_token
        };
        const userInfo = await axios.get(process.env.NAVER_USERINFO_URL as string, {
            headers: header
        });
        res.locals = {
            id: "naver" + userInfo.data.response.id,
            email: userInfo.data.response.email,
            name: userInfo.data.response.name,
            icon: userInfo.data.response.profile_image
        };
        next();
    },
    kakao: async (req: Request, res: Response, next: NextFunction) => {
        const { code } = req.query;
        const data = {
            grant_type: "authorization_code",
            client_id: process.env.KAKAO_CLIENT_ID as string,
            code: code as string
        };

        const queryString = `grant_type=${data.grant_type}&client_id=${data.client_id}&code=${data.code}`;

        const kakaoToken = await axios.post(
            process.env.KAKAO_TOKEN_URL as string,
            queryString
        );

        const header = {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            Authorization: "Bearer " + kakaoToken.data.access_token
        };

        const userInfo = await axios.get(process.env.KAKAO_USERINFO_URL as string, {
            headers: header
        });

        res.locals = {
            id: "kakao" + userInfo.data.id,
            email: userInfo.data.kakao_account.email,
            name: "test",
            icon: userInfo.data.properties.profile_image
        };
        next();
    }
};
