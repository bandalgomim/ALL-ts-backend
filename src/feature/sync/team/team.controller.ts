import { teamService } from "./team.service";
import { type patchTeamDto } from "@src/models/sync/team/team.dto";

export const teamController = {
  patch: async (req: patchTeamDto[]) => {
    const result = await teamService.patch(req);
    return result;
  }
};
