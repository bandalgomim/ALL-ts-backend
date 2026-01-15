import { patchMatchDto } from "@models/sync/match/match.dto";
import { matchDao } from "@src/models/sync/match/match.dao";

export const matchService = {
    get: async (date: string) => {
        const data = await matchDao.get(date);
        return data;

    },
    patch: async (data: patchMatchDto[]) => {
        const result = await matchDao.patch(data);
        return result;
    },
    patchMatchList: async (data: patchMatchDto[]): Promise<number> => {
        const result = await matchDao.patchMatchList(data);
        return result;
    }
};
