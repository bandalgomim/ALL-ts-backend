import { matchService } from "./match.service";
import { patchMatchDto } from "@src/models/sync/match/match.dto";

export const matchController = {
    get: async (date: string) => {
        const result = await matchService.get(date as string);
        return result;
    },
    patch: async (data: patchMatchDto[]) => {
        await matchService.patch(data);
    }
};
