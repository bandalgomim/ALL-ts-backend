import { iconDao } from "../../models/icon/icon.dao";
import { teamService } from "../team/team.service";
import { leagueService } from "../league/league.service";

export const iconService = {
    patchIcon: async (userId: string, type: "team" | "league", id: number, icon: string) => {
        await iconDao.patchIcon(userId, type, id, icon); // dao를 통해 업데이트
        let res;
        if (type === "team") {
            res = await teamService.get(userId, id); // 팀 아이콘 업데이트 후 팀 정보 가져오기
        } else if (type === "league") {
            res = await leagueService.get(userId, id); // 리그 아이콘 업데이트 후 리그 정보 가져오기
        } else {
            throw new Error("Invalid type provided for icon update");
        }
        return res;
    }
};
