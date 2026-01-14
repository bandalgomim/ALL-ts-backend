import { seasonService } from "./season.service";
import { patchSeasonDto } from "@src/models/sync/season/season.dto";

export const seasonController = {
    patch: async (data: patchSeasonDto) => {
        await seasonService.patch(data);
    }
};
