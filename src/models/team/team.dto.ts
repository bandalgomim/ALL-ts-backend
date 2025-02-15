import { match } from "../main/main.dto";

export interface team {
    teamId: number,
    teamName: string,
    teamLogo: string,
    leagueId: number,
    leagueName: string,
    sportId: number,
    sportName: string,
    countryId: number,
    countryName: string,
    isTeamSelected: boolean
}

export interface getTeamDto {
    team: team,
    calander: match[]
}
export { match };

