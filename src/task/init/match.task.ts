import { pandaScoreMatchInfo, apiFootballMatchInfo } from "@src/external_api";
import { matchService } from "@src/feature/sync/match/match.service";
import { patchMatchDto } from "@src/models/sync/match/match.dto";

export interface taskDto {
    leagueId: string,
    seasonId: string
}
export const matchTask = async (data: taskDto[]) => {
    for (const item of data) {
        const { leagueId, seasonId } = item;
        try {
            let result: patchMatchDto[] | null = null;

            if (leagueId.startsWith("pandascore")) {
                result = await pandaScoreMatchInfo(leagueId, seasonId);
            } else if (leagueId.startsWith("apifootball")) {
                result = await apiFootballMatchInfo(leagueId, seasonId);
            }

            if (!result || result.length === 0) {
                console.warn(`⚠️ 매치 없음 또는 조회 실패: ${leagueId} / ${seasonId}`);
                continue;
            }

            const ok = await matchService.patch(result);
            if (ok) {
                await matchService.patchMatchList(result);
            }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.error("❌ matchTask 실패", {
                leagueId
            });
            continue; // 다음 리그로
        }
    }

    console.log("매치 정보 업데이트 완료");
};

