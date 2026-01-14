import { isSelectedDao } from "@models/isSelected/isSelected.dao";
import { mainService } from "@feature/main/main.service";

export const isSelectedService = {
    patchTeam: async (userId: string, teamId: string) => {
        await isSelectedDao.patchTeam(userId, teamId); // dao를 통해 업데이트
        const res = mainService.get(userId);
        return res;
    },
    patchLeague: async (userId: string, leagueId: string) => {
        await isSelectedDao.patchLeague(userId, leagueId); // dao를 통해 업데이트
        const res = mainService.get(userId);
        return res;
    },
    patchMatch: async (userId: string, matchId: string) => {
        await isSelectedDao.patchMatch(userId, matchId); // dao를 통해 업데이트
        const res = mainService.get(userId);
        return res;
    }
};
