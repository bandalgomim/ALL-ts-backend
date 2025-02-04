
import { mainDao } from "../../models/main/main.dao";
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";
import { getMainDto, match, team } from "../../models/main/main.dto";

export const mainService = {
    get: async (userId: string) => {
        const result = await mainDao.get(userId); // dao의 정보를 반환
        const calander: match[] = []; // 각 항목이 들어갈 배열을 생성
        const favorite: team[] = [];

        result.map((data) => { // 매핑을 통해 배열에 알맞은 오브젝트를 생성 후 push
            const match = {
                matchId: data.match_id,
                matchDate: data.match_date,
                homeTeamId: data.home_team_id,
                awayTeamId: data.away_team_id,
                teamicon: data.teamIcon
            };
            const team = {
                teamId: data.team_id,
                teamName: data.team_name,
                teamIcon: data.teamIcon
            };
            calander.push(match);
            favorite.push(team);
        });

        const res: BaseApiResponse<getMainDto> = {
            ...status.SUCCESS.body,
            result: {
                calander: calander,
                favorite: [ ...new Set(favorite) ] // 중복 제거
            }
        };
        return res;
    },
    deleteMatch: async (userId: string, matchId: number) => {
        await mainDao.deleteMatch(userId, matchId); // 반환할 정보가 없음
        const res: BaseApiResponse<null> = {
            ...status.SUCCESS.body,
            result: null
        };
        return res;
    }
};
