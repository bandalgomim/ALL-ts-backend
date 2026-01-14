import { apiFootballRankInfo, pandaScoreRankInfo } from "@src/external_api";
import { taskDto } from "./match.task";
import { rankService } from "@src/feature/sync/rank/rank.service";
import { patchRankDto } from "@src/models/sync/rank/rank.dto";

export const rankTask = async (data: taskDto[]) => {
    for (const item of data) {
        const { leagueId, seasonId } = item;
        let result;
        if (leagueId.startsWith("pandascore")) {
            result = await pandaScoreRankInfo(leagueId, seasonId);
        } else if (leagueId.startsWith("apifootball")) {
            result = await apiFootballRankInfo(leagueId, seasonId);
        }
        await rankService.patch(result as patchRankDto[]);
    }
};