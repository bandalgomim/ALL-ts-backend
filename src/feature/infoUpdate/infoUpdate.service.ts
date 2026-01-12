import { infoUpdateDao } from "@models/infoUpdate/infoUpdate.dao";
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";
import { infoUpdateSeason, infoUpdateTeam } from "@models/infoUpdate/infoUpdate.dto";

export const infoUpdateService = {
    patchSeason: async (req: infoUpdateSeason) => {
        await infoUpdateDao.patchSeason(req);
        const res: BaseApiResponse<null> = {
            ...status.SUCCESS.body,
            result: null
        };
        return res;
    },
    patchTeam: async (req: infoUpdateTeam[]) => {
        await infoUpdateDao.patchTeam(req);
        const res: BaseApiResponse<null> = {
            ...status.SUCCESS.body,
            result: null
        };
        return res;
    }
};
