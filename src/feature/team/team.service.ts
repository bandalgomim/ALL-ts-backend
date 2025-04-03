
import { teamDao } from "../../models/team/team.dao";
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";
import { getTeamDto, match } from "../../models/team/team.dto";
import moment from "moment";

export const teamService = {
    get: async (userId: string, teamId: number) => {
        const result = await teamDao.get(userId, teamId); // dao의 정보를 반환
        const matchList: match[] = []; // 각 항목이 들어갈 배열을 생성
        if (result[0].match_id) {
            result.map((data) => { // 매핑을 통해 배열에 알맞은 오브젝트를 생성 후 push
                matchList.push({
                    matchId: data.match_id,
                    matchDate: moment.utc(data.match_date).tz("Asia/Seoul")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    matchState: data.match_state,
                    homeTeamId: data.home_team_id,
                    awayTeamId: data.away_team_id,
                    homeTeamName: data.home_team_name,
                    awayTeamName: data.away_team_name,
                    homeTeamInit: data.home_team_initial,
                    awayTeamInit: data.away_team_initial,
                    hometeamLogo: data.home_team_logo,
                    awayteamLogo: data.away_team_logo,
                    homeTeamScore: data.home_team_score,
                    awayTeamScore: data.away_team_score,
                    userId: data.user_id,
                    isMatchSelected: Boolean(data.is_match_selected)
                });
            });
        }

        const res: BaseApiResponse<getTeamDto> = {
            ...status.SUCCESS.body,
            result: {
                team: {
                    teamId: result[0].team_id,
                    teamName: result[0].team_name,
                    teamLogo: result[0].team_logo,
                    leagueId: result[0].league_id,
                    leagueName: result[0].league_name,
                    sportId: result[0].sport_id,
                    sportName: result[0].sport_name,
                    countryId: result[0].country_id,
                    countryName: result[0].country_name,
                    isTeamSelected: Boolean(result[0].is_team_selected)
                },
                matchList: matchList.reverse() // 중복 제거
            }
        };
        return res;
    }
};
