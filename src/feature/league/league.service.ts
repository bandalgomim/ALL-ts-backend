import { leagueDao } from "../../models/league/league.dao";
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";
import { getLeagueDto, team, match, league } from "../../models/league/league.dto";

export const leagueService = {
    get: async (leagueId: number) => {
        const result = await leagueDao.get(leagueId); // dao의 정보를 반환
        const league: league = {
            leagueId: result[0].league_id,
            leagueName: result[0].league_name,
            sportId: result[0].sport_id,
            sportName: result[0].sport_name,
            countryId: result[0].country_id,
            countryName: result[0].country_name
        }; // 각 항목이 들어갈 배열을 생성
        const team: team[] = [];
        const match: match[] = [];

        result.map((data) => { // 매핑을 통해 배열에 알맞은 오브젝트를 생성 후 push
            if (data.match_id !== null) {
                match.push({
                    matchId: data.match_id,
                    matchDate: data.match_date,
                    matchState: data.match_state,
                    homeTeamId: data.home_team_id,
                    awayTeamId: data.away_team_id,
                    hometeamLogo: data.home_team_logo,
                    awayteamLogo: data.away_team_logo,
                    homeTeamScore: data.home_team_score,
                    awayTeamScore: data.away_team_score,
                    isMatchSelected: data.is_match_selected
                });
            } else {
                team.push({
                    teamId: data.team_id,
                    teamName: data.team_name,
                    teamLogo: data.team_logo
                });
            }
        });
        const res: BaseApiResponse<getLeagueDto> = {
            ...status.SUCCESS.body,
            result: {
                league: league,
                team: team,
                match: match
            }
        };
        return res;
    }
};
