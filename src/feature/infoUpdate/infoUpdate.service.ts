import { infoUpdateDao } from "../../models/infoUpdate/infoUpdate.dao";
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";
import { infoUpdate, teamInfo } from "../../models/infoUpdate/infoUpdate.dto";

export const infoUpdateService = {
    patchLeague: async (leagueId: number, leagueLogo: string) => {
        await infoUpdateDao.patchLeague(leagueId, leagueLogo);
        const res: BaseApiResponse<null> = {
            ...status.SUCCESS.body,
            result: null
        };
        return res;
    },
    patchSeason: async (seasonId: number, leagueId: number, seasonName: string) => {
        await infoUpdateDao.patchSeason(seasonId, leagueId, seasonName);
        const res: BaseApiResponse<null> = {
            ...status.SUCCESS.body,
            result: null
        };
        return res;
    },
    patchTeam: async (team: teamInfo) => {
        await infoUpdateDao.patchTeam(team);
        const res: BaseApiResponse<null> = {
            ...status.SUCCESS.body,
            result: null
        };
        return res;
    },
    patchAll: async (data: infoUpdate) => {
        await infoUpdateDao.patchAll(data);
        const res: BaseApiResponse<{ updatedTeamCount: number }> = {
            ...status.SUCCESS.body,
            result: {
                updatedTeamCount: data.teamInfo.length
            }
        };
        return res;
    }
};
