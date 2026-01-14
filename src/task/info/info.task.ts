import { apiFootballMatchToday, apiFootballRankInfo, pandaScoreMatchToday, pandaScoreRankInfo } from "@src/external_api";
import { getTodayYMD } from "../init/init.task";
import { matchService } from "@src/feature/sync/match/match.service";
import { rankService } from "@src/feature/sync/rank/rank.service";
import { patchMatchDto } from "@src/models/sync/match/match.dto";
import { patchRankDto } from "@src/models/sync/rank/rank.dto";

export const infoTask = async (leagueId: string, seasonId: string) => {
    const today = getTodayYMD();
    let rank;
    let match;
    if (leagueId.startsWith("pandascore")) {
        rank = await pandaScoreRankInfo(leagueId, seasonId);
        match = await pandaScoreMatchToday(leagueId, seasonId, today);
    } else if (leagueId.startsWith("apifootball")) {
        rank = await apiFootballRankInfo(leagueId, seasonId);
        match = await apiFootballMatchToday(leagueId, seasonId, today);
    }
    await matchService.patch(match as patchMatchDto[]);
    await rankService.patch(rank as patchRankDto[]);
};
