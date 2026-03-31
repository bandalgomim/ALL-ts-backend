import { apiFootballRankInfo, pandaScoreRankInfo } from "@src/external_api";
import { type taskDto } from "./match.task";
import { rankService } from "@src/feature/sync/rank/rank.service";
import { type patchRankDto } from "@src/models/sync/rank/rank.dto";

export const rankTask = async (data: taskDto[]) => {
  for (const item of data) {
    console.log(item);

    const { leagueId, seasonId } = item;
    try {
      let result;

      if (leagueId.startsWith("pandascore")) {
        result = await pandaScoreRankInfo(leagueId, seasonId);
      } else if (leagueId.startsWith("apifootball")) {
        result = await apiFootballRankInfo(leagueId, seasonId);
      } else {
        console.warn(`⚠️ 알 수 없는 leagueId: ${leagueId}`);
        continue;
      }

      if (!result || result.length === 0) {
        console.warn(`⚠️ 랭킹 없음 또는 조회 실패: ${leagueId} / ${seasonId}`);
        continue;
      }

      await rankService.patch(result as patchRankDto[]);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error("❌ rankTask 실패", {
        leagueId
      });
      continue; // 다음 리그로
    }
  }

  console.log("랭킹 정보 업데이트 완료");
};
