import { ApiError } from "../../../../config/error";
import { status } from "../../../../config/response.status";
import { IAMDao } from "../../../models/auth/IAM/IAM.dao";
import { tokenUtils } from "../../../utils/jwt.utils";
import { postSignUpDto, headers } from "../../../models/auth/IAM/IAM.dto";
import jwt  from "jsonwebtoken";


export const IAMService = {
    login: async (userId: string) => {
        const success = await IAMDao.getLogin(userId);
        if (success) {
            const [ accessToken, refreshToken ] = await tokenUtils.login(userId);
            return [ true, accessToken, refreshToken ];
        } else {
            return [ false, "", "" ];
        }
    },
    signUp: async (body: postSignUpDto) => {
        const result = await IAMDao.postSignUp(body);
        if (result === -1) {
            return [ false, "", "" ];
        } else {
            const [ accessToken, refreshToken ] = await tokenUtils.login(body.userId);
            return [ true, accessToken, refreshToken ];
        }
    },
    refreshToken: async (headers: headers) => {
        if (headers.Authorization && headers.RefreshToken) {
            const authToken = headers.Authorization.split(" ")[1];
            const refreshToken = headers.RefreshToken;
            const authResult = tokenUtils.verify(authToken);
            const decoded = jwt.decode(authToken) as jwt.JwtPayload;
            if (decoded === null) {
                throw new ApiError(status.ACCESS_TOKEN_UNMATCHED);
            }

            const refreshResult = await tokenUtils.refreshVerify(refreshToken, decoded.sub as string);
            if (authResult.ok === false) {
                // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
                if (refreshResult === false) {
                    throw new ApiError(status.REFRESH_TOKEN_UNMATCHED);
                } else {
                    // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
                    const newAccessToken = tokenUtils.sign(decoded.sub as string);
                    return newAccessToken;
                }
            } else {
                // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
                throw new ApiError(status.ACCESS_TOKEN_IS_VALID);
            }
        } else { // access token 또는 refresh token이 헤더에 없는 경우
            if (!headers.Authorization && !headers.RefreshToken) {
                throw new ApiError(status.THERE_IS_NO_TOKEN);
            } else if (!headers.RefreshToken) {
                throw new ApiError(status.THERE_IS_NO_REFRESH_TOKEN);
            } else {
                throw new ApiError(status.THERE_IS_NO_ACCESS_TOKEN);
            }
        }
    },
    delete: async (userId: string): Promise<void> => {
        await IAMDao.delete(userId);
    }
};
