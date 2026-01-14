import { patchMatchDto } from "@models/sync/match/match.dto";
import { matchDao } from "@src/models/sync/match/match.dao";

export const matchService = {
    get: async (date: string) => {
        const data = await matchDao.get(date);
        return data;

    },
    patch: async (data: patchMatchDto[]) => {
        await matchDao.patch(data);
    }
};
