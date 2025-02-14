import { match } from "../team/team.dto";

export interface league {
    leagueId: number,
    leagueName: string,
    sportId: number,
    sportName: string,
    countryId: number,
    countryName: string
}

export interface team {
    teamId: number,
    teamName: string,
    teamLogo: string
}

export interface getLeagueDto {
    league: league,
    team: team[],
    match: match[]
}
export { match };

