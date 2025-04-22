import { leagueDao } from "../../models/league/league.dao";
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";
import { getLeagueDto, team, league } from "../../models/league/league.dto";
import { match, matchList } from "../../models/main/main.dto";

export const leagueService = {
    get: async (userId: string, leagueId: number) => {
        const result = await leagueDao.get(userId, leagueId);
        const league: league = {
            leagueId: result[0].league_id,
            leagueName: result[0].league_name,
            leagueLogo: result[0].league_logo,
            sportId: result[0].sport_id,
            sportName: result[0].sport_name,
            countryId: result[0].country_id,
            countryName: result[0].country_name,
            isSelected: Boolean(result[0].is_league_selected)
        };
        const teamList: team[] = [];
        const matchList: matchList = {};
        let matchItems: match[] = [];
        let prevDate: string | null = null;

        result.forEach((data) => {
            if (data.match_id !== null) {
                const currDate = new Date(data.match_date).toISOString()
                    .split("T")[0];
                if (prevDate && prevDate !== currDate) {
                    matchList[prevDate] = matchItems;
                    matchItems = [];
                }
                matchItems.push({
                    matchId: data.match_id,
                    matchDate: currDate,
                    matchTime: data.match_time,
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
                prevDate = currDate;
            } else {
                teamList.push({
                    teamId: data.team_id,
                    teamName: data.team_name,
                    teamInit: data.team_initial,
                    teamLogo: data.team_logo
                });
            }
        });

        // 마지막 날짜의 matchItems도 추가
        if (matchItems.length > 0 && prevDate) {
            matchList[prevDate] = matchItems;
        }

        const res: BaseApiResponse<getLeagueDto> = {
            ...status.SUCCESS.body,
            result: {
                league: league,
                teamList: teamList,
                matchList: matchList // 날짜별로 묶인 matchList
            }
        };
        return res;
    }
};
