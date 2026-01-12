import { iconDao } from "@models/icon/icon.dao";
import { teamService } from "@feature/team/team.service";
import { leagueService } from "@feature/league/league.service";

export const iconService = {
    patchIcon: async (userId: string, type: string, id: string, uri: string) => {
        await iconDao.patchIcon(userId, type, id, uri); // dao를 통해 업데이트
        let res;
        if (type === "team") {
            res = await teamService.get(userId, id);
        } else if (type === "league") {
            res = await leagueService.get(userId, id); // 리그 아이콘 업데이트 후 리그 정보 반환
        } else {
            throw new Error("Invalid type provided for icon update");
        }
        return res;
    }
};
