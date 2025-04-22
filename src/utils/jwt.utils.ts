import jwt, { JwtPayload } from "jsonwebtoken";
import redisClient from "./../../config/db.redis";
import { config } from "dotenv";
import { ApiError } from "../../config/error";
import { status } from "../../config/response.status";

config();

const secret: string = process.env.SECRET as string;
if (!secret) {
    throw new ApiError(status.JWT_SECRET_NOT_FOUND);
}
export const tokenUtils = {
    sign: (user: string) => {
        // access token 발급
        const payload = {
            iss: "https://api.ballog.store",
            sub: user
        };
        return jwt.sign(payload, secret, {
            algorithm: "HS256",
            expiresIn: "1h"
        });
    },
    login: async (user_id: string) => {
        const accessToken = tokenUtils.sign(user_id);
        const refreshToken = tokenUtils.refresh();
        await redisClient.set(user_id, refreshToken);
        return [ accessToken, refreshToken ];
    },
    verify: (token: string) => {
        try {
            const decoded = jwt.verify(token, secret) as JwtPayload;
            return {
                ok: true,
                sub: decoded.sub
            };
        } catch {
            return {
                ok: false
            };
        }
    },
    refresh: () => {
        return jwt.sign({}, secret, {
            algorithm: "HS256",
            expiresIn: "24h"
        });
    },
    refreshVerify: async (token: string, userId: string) => {
        try {
            const data = await redisClient.get(userId);
            if (token === data) {
                try {
                    jwt.verify(token, secret);
                    return true;
                } catch {
                    throw new ApiError(status.JWT_VERIFICATIN_FAILED);
                }
            } else {
                return false;
            }
        } catch (error) {
            if (error instanceof Error) {
                return false;
            } else {
                throw new Error("Unknown Redis error");
            }
        }
    }
};
