import { pandaScoreTeamData, apiFootballTeamData } from "@src/external_api";
import { teamService } from "@src/feature/sync/team/team.service";
import { patchTeamDto } from "@src/models/sync/team/team.dto";

export interface taskDto {
    leagueId: string,
    seasonId: string
}

export const teamTask = async (data: taskDto[]) => {
    for (const item of data) {
        const { leagueId } = item;

        try {
            let result;

            if (leagueId.startsWith("pandascore")) {
                result = await pandaScoreTeamData(leagueId);
            } else if (leagueId.startsWith("apifootball")) {
                result = await apiFootballTeamData(leagueId);
            } else {
                console.warn(`⚠️ 알 수 없는 leagueId: ${leagueId}`);
                continue;
            }

            if (!result || result.length === 0) {
                console.warn(`⚠️ 팀 정보 없음 또는 조회 실패: ${leagueId}`);
                continue;
            }

            await teamService.patch(result as patchTeamDto[]);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.error("❌ teamTask 실패", {
                leagueId
            });
            continue; // 다음 리그
        }
    }
    console.log("팀 정보 업데이트 완료");
};

