import { type patchRankDto } from "@models/sync/rank/rank.dto";
import { rankService } from "@feature/sync/rank/rank.service";

export const rankController = {
  patch: async (data: patchRankDto[]) => {
    await rankService.patch(data);
  }
};
