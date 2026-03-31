import { seasonDao } from "@src/models/sync/season/season.dao";
import { type patchSeasonDto } from "@src/models/sync/season/season.dto";

export const seasonService = {
  patch: async (data: patchSeasonDto) => {
    await seasonDao.patch(data);
  }
};
