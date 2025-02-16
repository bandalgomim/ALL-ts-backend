
import { mainDao } from "../../models/main/main.dao";
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";
import { getMainDto, match, team } from "../../models/main/main.dto";

export const mainService = {
    get: async (userId: string) => {
        const result = await mainDao.get(userId); // dao의 정보를 반환
        const matchList: match[] = []; // 각 항목이 들어갈 배열을 생성
        const teamList: team[] = [];

        result.map((data) => { // 매핑을 통해 배열에 알맞은 오브젝트를 생성 후 push
            matchList.push({
                matchId: data.match_id,
                matchDate: data.match_date,
                matchState: data.match_state,
                homeTeamId: data.home_team_id,
                awayTeamId: data.away_team_id,
                hometeamLogo: data.home_team_logo,
                awayteamLogo: data.data.away_team_logo,
                isMatchSelected: true
            });
            teamList.push({
                teamId: data.team_id,
                teamName: data.team_name,
                teamLogo: data.teamLogo
            });
        });

        const res: BaseApiResponse<getMainDto> = {
            ...status.SUCCESS.body,
            result: {
                matchList: matchList,
                teamList: [ ...new Set(teamList) ] // 중복 제거
            }
        };
        return res;
    }
};
