import { status } from "../../../../config/response.status";
import { type BaseApiResponse } from "../../../../config/response";
import { type patchTeamDto } from "@src/models/sync/team/team.dto";
import { teamDao } from "@src/models/sync/team/team.dao";

export const teamService = {
  patch: async (req: patchTeamDto[]) => {
    await teamDao.patch(req);
    const res: BaseApiResponse<null> = {
      ...status.SUCCESS.body,
      result: null
    };
    return res;
  }
};
