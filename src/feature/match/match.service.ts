import { matchDao } from "../../models/match/match.dao";
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";
import { getMatchDto, platform } from "../../models/match/match.dto";

export const matchService = {
    get: async (matchId: number) => {
        const result = await matchDao.get(matchId); // dao의 정보를 반환
        const platform: platform[] = [];
        console.log("match service: matchId " + result);
        result.map((data) => {
            // 매핑을 통해 배열에 알맞은 오브젝트를 생성 후 push
            platform.push({
                platformId: data.platform_id,
                platformName: data.platform_name,
                platformlogo: data.platform_logo,
                platformUrl: data.platform_url
            });
        });
        const res: BaseApiResponse<getMatchDto> = {
            ...status.SUCCESS.body,
            result: {
                matchId: result[0].match_id,
                matchDate: result[0].match_date,
                homeTeamId: result[0].home_team_id,
                awayTeamId: result[0].away_team_id,
                hometeamLogo: result[0].home_team_logo,
                awayteamLogo: result[0].away_team_logo,
                homeTeamScore: result[0].home_team_score,
                awayTeamScore: result[0].away_team_score,
                matchState: result[0].match_state,
                isMatchSelected: result[0].is_match_selected,
                platform: platform
            }
        };
        return res;
    }
};
