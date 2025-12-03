import { tokenUtils } from "./jwt.utils";
import { Request, Response, NextFunction } from "express";
import { status } from "../../config/response.status";
import { config } from "dotenv";
import { ApiError } from "../../config/error";
import { IAMController } from "../feature/IAM/IAM.controller";
import { OAuth2Client } from "google-auth-library";
import { createRemoteJWKSet, jwtVerify } from "jose";

config();

export const tokenMinddleware = {
    auth: async  (req: Request, res: Response, next: NextFunction) => {
        if (req.headers.authorization) {
            const accessToken = req.headers.authorization as string;
            const token = accessToken.split(" ")[1];
            const result = tokenUtils.verify(token); // token을 검증합니다.
            if (result.ok) {
                res.locals.userId = result.sub;
                next();
            } else {
                await IAMController.refreshToken(req, res);
            }
        } else {
            throw new ApiError(status.THERE_IS_NO_ACCESS_TOKEN);
        }
    },
    googleMiddleware: async (req: Request, res: Response, next: NextFunction) => {
        const client = new OAuth2Client(
            process.env.GOOGLE_WEB_CLIENT_ID // Web Client ID
        );
        try {
            const { idToken } = req.body; // 프론트에서 전달받은 idToken

            // ✅ 토큰 검증 및 디코드
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_WEB_CLIENT_ID
            });

            const payload = ticket.getPayload();
            if (!payload) throw new Error("Invalid token");

            // payload 안에 들어 있는 값
            // sub: 구글 고유 ID, email, name, picture 등
            res.locals = {
                userId: "google" + payload.sub,
                email: payload.email,
                name: payload.name,
                icon: payload.picture
            };
            next();
        } catch (err) {
            console.error("Google ID Token 검증 실패:", err);
            res.status(401).json({ success: false, error: "Invalid Google token" });
        }
    },
    appleMiddleware: async (req: Request, res: Response, next: NextFunction) => {
        const APP_BUNDLE_ID = process.env.APP_BUNDLE_ID!; // e.g. com.yourcompany.yourapp
        const JWKS = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys".replace("appleid.", "appleid.")));
        try {
            const { identityToken } = req.body.idToken; // 프론트에서 전달받은 idToken
            if (!identityToken) throw new Error("identityToken 누락");

            const { payload } = await jwtVerify(identityToken, JWKS, {
                issuer: "https://appleid.apple.com",
                audience: APP_BUNDLE_ID
            });
            res.locals = {
                userId: "apple" + payload.sub,
                email: payload.email,
                name: req.body.name ?? null,
                icon: null
            };

            next();
        } catch (err) {
            console.error("Apple ID Token 검증 실패:", err);
            res.status(401).json({ message: "Unauthorized" });
        }
    }
};
