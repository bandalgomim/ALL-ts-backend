import { teamDao } from "../../models/team/team.dao";
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";
import { getTeamDto } from "../../models/team/team.dto";
import { match, matchList } from "../../models/main/main.dto";

export const teamService = {
    get: async (userId: string, teamId: number) => {
        const result = await teamDao.get(userId, teamId);
        const matchList: matchList = {};
        let matchItems: match[] = [];
        let prevDate: string | null = null;

        if (result[0].match_id) {
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
                }
            });

            // 마지막 날짜의 matchItems도 추가
            if (matchItems.length > 0 && prevDate) {
                matchList[prevDate] = matchItems;
            }
        }

        const res: BaseApiResponse<getTeamDto> = {
            ...status.SUCCESS.body,
            result: {
                team: {
                    teamId: result[0].team_id,
                    teamName: result[0].team_name,
                    teamLogo: result[0].team_logo,
                    rank: result[0].rank,
                    win: result[0].win,
                    draw: result[0].draw,
                    rose: result[0].rose,
                    point: result[0].point,
                    section: result[0].section,
                    leagueId: result[0].league_id,
                    leagueName: result[0].league_name,
                    sportId: result[0].sport_id,
                    sportName: result[0].sport_name,
                    countryId: result[0].country_id,
                    countryName: result[0].country_name,
                    isTeamSelected: Boolean(result[0].is_team_selected)
                },
                matchList: matchList // 날짜별로 묶인 matchList
            }
        };
        return res;
    }
};
