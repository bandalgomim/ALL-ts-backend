import { status } from "../../../../config/response.status";
import { BaseApiResponse } from "../../../../config/response";
import { seasonDao } from "@src/models/sync/season/season.dao";
import { patchSeasonDto } from "@src/models/sync/season/season.dto";

export const seasonService = {
    patch: async (req: patchSeasonDto) => {
        await seasonDao.patch(req);
        const res: BaseApiResponse<null> = {
            ...status.SUCCESS.body,
            result: null
        };
        return res;
    }
};
