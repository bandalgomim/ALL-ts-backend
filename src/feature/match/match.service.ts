import { matchDao } from "../../models/match/match.dao";
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";
import { getMatchDto, platform } from "../../models/match/match.dto";
import moment from "moment-timezone";

export const matchService = {
    get: async (matchId: number) => {
        const result = await matchDao.get(matchId); // dao의 정보를 반환
        const platform: platform[] = [];
        console.log(result[0]);
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
                matchDate: moment.utc(result[0].match_date).tz("Asia/Seoul")
                    .format("YYYY-MM-DD HH:mm:ss"),
                homeTeamId: result[0].home_team_id,
                awayTeamId: result[0].away_team_id,
                homeTeamName: result[0].home_team_name,
                awayTeamName: result[0].away_team_name,
                homeTeamInit: result[0].home_team_initial,
                awayTeamInit: result[0].away_team_initial,
                hometeamLogo: result[0].home_team_logo,
                awayteamLogo: result[0].away_team_logo,
                homeTeamScore: result[0].home_team_score,
                awayTeamScore: result[0].away_team_score,
                sportName: result[0].sport_name,
                homeCountryName: result[0].home_country_name,
                awayCountryName: result[0].away_country_name,
                homeLeagueName: result[0].home_league_name,
                awayLeagueName: result[0].away_league_name,
                matchState: result[0].match_state,
                isMatchSelected: Boolean(result[0].is_match_selected),
                platform: platform
            }
        };
        return res;
    }
};


