import { pandaScoreTeamData, apiFootballTeamData } from "@src/external_api";
import { teamService } from "@src/feature/sync/team/team.service";
import { patchTeamDto } from "@src/models/sync/team/team.dto";

export interface taskDto {
    leagueId: string,
    seasonId: string
}

export const teamTask = async (data: taskDto[]) => {
    for (const item of data) {
        const { leagueId, seasonId } = item;
        let result;
        if (leagueId.startsWith("pandascore")) {
            result = await pandaScoreTeamData(leagueId);
        } else if (leagueId.startsWith("apifootball")) {
            result = await apiFootballTeamData(leagueId);
        }
        /*if (result) {
            for (const r of result) {
                console.log(r);
                const data = [ r ];
                await teamService.patch(data as patchTeamDto[]);
            }
        }*/
        
        await teamService.patch(result as patchTeamDto[]);
    }
};