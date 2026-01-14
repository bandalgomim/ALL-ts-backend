import { rankDto } from "@models/sync/rank/rank.dto";
import { rankService } from "@feature/sync/rank/rank.service";

export const rankController = {
    patch: async (data: rankDto[]) => {
        await rankService.patch(data);
    }
};

