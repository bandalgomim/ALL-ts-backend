import { isSelectedDao } from "../../models/isSelected/isSelected.dao";
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";

export const isSelectedService = {
    patchTeam: async (userId: string, teamId: number) => {
        await isSelectedDao.patchTeam(userId, teamId); // dao를 통해 업데이트

        const res: BaseApiResponse<null> = {
            ...status.SUCCESS.body,
            result: null
        };
        return res;
    },
    patchMatch: async (userId: string, matchId: number) => {
        await isSelectedDao.patchMatch(userId, matchId); // dao를 통해 업데이트

        const res: BaseApiResponse<null> = {
            ...status.SUCCESS.body,
            result: null
        };
        return res;
    }
};
