import { mainDao } from "@models/main/main.dao";
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";
import { getMainDto, league, matchList, match, patchMainReqDto, team } from "@models/main/main.dto";

export const mainService = {
    get: async (userId: string) => {
        const result = await mainDao.get(userId); // dao의 정보를 반환
        const matchList: matchList = {};
        let matchItems: match[] = [];
        let prevDate: string | null = null;
        const teamList: team[] = [];
        const leagueList: league[] = [];
        result.forEach((data) => {
            if (data.match_id !== null && data.is_match_selected !== 0) {
                if (prevDate && prevDate !== data.match_date) {
                    matchList[prevDate] = matchItems;
                    matchItems = [];
                }
                matchItems.push({
                    matchId: data.match_id,
                    matchDate: data.match_date,
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
                prevDate = data.match_date;
            }
            if (data.team_id !== null && data.is_team_selected !== 0) {
                teamList.push({
                    teamId: data.team_id,
                    teamName: data.team_name,
                    teamInit: data.team_initial,
                    teamLogo: data.team_logo,
                    index: data.team_index
                });
            }
            if (data.league_id !== null && data.is_league_selected !== 0) {
                leagueList.push({
                    leagueId: data.league_id,
                    leagueName: data.league_name,
                    leagueInit: data.league_initial,
                    leagueLogo: data.league_logo,
                    index: data.league_index
                });
            }
        });

        // 마지막 날짜의 matchItems도 추가
        if (matchItems.length > 0 && prevDate) {
            matchList[prevDate] = matchItems;
        }

        const res: BaseApiResponse<getMainDto> = {
            ...status.SUCCESS.body,
            result: {
                matchList: matchList,
                teamAndLeagueList: [ ...teamList, ...leagueList ].sort((a, b) => a.index - b.index)
            }
        };
        return res;
    },
    patch: async (userId: string, index: patchMainReqDto[]) => {
        await mainDao.patch(userId, index);
        const res: BaseApiResponse<null> = {
            ...status.SUCCESS.body,
            result: null
        };

        return res;
    }
};
