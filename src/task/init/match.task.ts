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
        let result;
        if (leagueId.startsWith("pandascore")) {
            result = await pandaScoreMatchInfo(leagueId, seasonId);
        } else if (leagueId.startsWith("apifootball")) {
            result = await apiFootballMatchInfo(leagueId, seasonId);
        }

        /* if (result) {
            for (const r of result) {
                console.log(r);
                const data = [ r ];
                await matchService.patch(data as patchMatchDto[]);
            }
        }*/
        const ok = await matchService.patch(result as patchMatchDto[]);
        if (ok) {
            await matchService.patchMatchList(result as patchMatchDto[]);
        }
    }
    console.log("매치 정보 업데이트 완료");
};
