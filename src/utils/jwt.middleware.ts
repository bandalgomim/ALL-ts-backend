import { tokenUtils } from "./jwt.utils";
import { Request, Response, NextFunction } from "express";
import { status } from "../../config/response.status";
import { config } from "dotenv";
import { ApiError } from "../../config/error";
import { IAMController } from "../feature/auth/IAM/IAM.controller";
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
                res.locals.id = result.sub;
                next();
            } else {
                await IAMController.refreshToken(req, res);
            }
        } else {
            throw new ApiError(status.THERE_IS_NO_ACCESS_TOKEN);
        }
    },
    sns: async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body);
        const type = req.body.type;
        if (type === "google") {
            await tokenMinddleware.googleMiddleware(req, res, next);
        } else if (type === "apple") {
            await tokenMinddleware.appleMiddleware(req, res, next);
        }
    },
    googleMiddleware: async (req: Request, res: Response, next: NextFunction) => {
        const client = new OAuth2Client(
            process.env.GOOGLE_WEB_CLIENT_ID // Web Client ID
        );
        try {
            const { idToken } = req.body; // 프론트에서 전달받은 idToken
            console.log("Google ID Token:", req.body);

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
            console.log(res.locals);
            next();
        } catch (err) {
            console.error("Google ID Token 검증 실패:", err);
            res.status(401).json({ success: false, error: "Invalid Google token" });
        }
    },
    appleMiddleware: async (req: Request, res: Response, next: NextFunction) => {
        const APP_BUNDLE_ID = process.env.APP_BUNDLE_ID!; // e.g. com.yourcompany.yourapp
        const JWKS = createRemoteJWKSet(new URL("https://appleid.appleid.com/auth/keys".replace("appleid.", "appleid.")));
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { identityToken, user, nonce } = req.body.idToken; // 프론트에서 전달받은 idToken
            if (!identityToken) throw new Error("identityToken 누락");

            // jwtVerify: iss, aud 등 검증
            const { payload } = await jwtVerify(identityToken, JWKS, {
                issuer: "https://appleid.apple.com",
                audience: APP_BUNDLE_ID
            });

            // 필요시 nonce 검증(프론트에서 보낸 rawNonce를 SHA-256 한 값이 토큰의 nonce와 일치하는지)
            // if (payload.nonce && nonce) { ... }

            // payload.sub: Apple 고유 사용자 ID (user와 동일 계열)
            // payload.email: 최초에만 있을 수 있음
            // 여기서 우리 서비스 유저로 매핑
            res.locals = {
                id: "apple" + (user ?? payload.sub),
                email: payload.email,          // null일 수 있음
                name: req.body.name ?? null,   // 최초 동의 때만 오므로 body에서 보낸 값을 우선
                icon: null,                    // 애플은 기본 프로필 이미지를 제공하지 않음
                raw: payload
            };

            next();
        } catch (err) {
            console.error("Apple ID Token 검증 실패:", err);
            res.status(401).json({ message: "Unauthorized" });
        }
    }
};
