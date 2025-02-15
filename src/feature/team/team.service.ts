
import { teamDao } from "../../models/team/team.dao";
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";
import { getTeamDto, match } from "../../models/team/team.dto";

export const teamService = {
    get: async (teamId: number) => {
        const result = await teamDao.get(teamId); // dao의 정보를 반환
        const calander: match[] = []; // 각 항목이 들어갈 배열을 생성

        result.map((data) => { // 매핑을 통해 배열에 알맞은 오브젝트를 생성 후 push
            calander.push({
                matchId: data.match_id,
                matchDate: data.match_date,
                matchState: data.match_state,
                homeTeamId: data.home_team_id,
                awayTeamId: data.away_team_id,
                hometeamLogo: data.home_team_logo,
                awayteamLogo: data.data.away_team_logo,
                isMatchSelected: data.is_match_selected
            });
        });

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
                    isTeamSelected: result[0].is_team_selected
                },
                calander: calander // 중복 제거
            }
        };
        return res;
    },
    patchMatch: async (userId: string, matchId: number) => {
        await teamDao.patchMatch(userId, matchId); // 반환할 정보가 없음
        const res: BaseApiResponse<null> = {
            ...status.SUCCESS.body,
            result: null
        };
        return res;
    }
};
