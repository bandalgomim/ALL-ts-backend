import { type patchRankDto } from "@models/sync/rank/rank.dto";
import { rankDao } from "@models/sync/rank/rank.dao";

export const rankService = {
  patch: async (data: patchRankDto[]) => {
    await rankDao.patch(data);
  }
};
