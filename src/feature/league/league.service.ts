import { leagueDao } from "../../models/league/league.dao";
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";
import { getLeagueDto, team, match, league } from "../../models/league/league.dto";
import moment from "moment";

export const leagueService = {
    get: async (userId: string, leagueId: number) => {
        const result = await leagueDao.get(userId, leagueId); // dao의 정보를 반환
        const league: league = {
            leagueId: result[0].league_id,
            leagueName: result[0].league_name,
            leagueLogo: result[0].league_logo,
            sportId: result[0].sport_id,
            sportName: result[0].sport_name,
            countryId: result[0].country_id,
            countryName: result[0].country_name,
            isSelected: Boolean(result[0].is_league_selected)
        }; // 각 항목이 들어갈 배열을 생성
        const teamList: team[] = [];
        const matchList: match[] = [];

        result.map((data) => { // 매핑을 통해 배열에 알맞은 오브젝트를 생성 후 push
            if (data.match_id !== null) {
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
            } else {
                teamList.push({
                    teamId: data.team_id,
                    teamName: data.team_name,
                    teamInit: data.team_initial,
                    teamLogo: data.team_logo
                });
            }
        });
        const res: BaseApiResponse<getLeagueDto> = {
            ...status.SUCCESS.body,
            result: {
                league: league,
                teamList: teamList,
                matchList: matchList.reverse()
            }
        };
        return res;
    }
};
