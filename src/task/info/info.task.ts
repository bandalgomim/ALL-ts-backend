import { apiFootballMatchToday, apiFootballRankInfo, pandaScoreMatchToday, pandaScoreRankInfo } from "@src/external_api";
import { getTodayYMD } from "../init/init.task";
import { matchService } from "@src/feature/sync/match/match.service";
import { rankService } from "@src/feature/sync/rank/rank.service";
import { patchMatchDto } from "@src/models/sync/match/match.dto";
import { patchRankDto } from "@src/models/sync/rank/rank.dto";
import redisClient from "config/db.redis";
import { sentNotificationLive } from "@src/feature/fcm/sentNotification.controller";
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
    if (match) {
        for (const m of match) {
            if (m.status === "live") {
                const key = `push:live:${m.matchId}`;
                const ok = await redisClient.set(key, "1", {
                    NX: true,
                    EX: 72 * 60 * 60
                });
                if (ok === "OK") {
                    await sentNotificationLive(m.matchId);
                }
            }
        }
    }
    await matchService.patch(match as patchMatchDto[]);
    await rankService.patch(rank as patchRankDto[]);
};
