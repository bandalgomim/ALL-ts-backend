import { matchList } from "@models/main/main.dto";

export interface team {
    teamId: number,
    teamName: string,
    teamInit: string,
    teamLogo: string,
    rank: string,
    win: string,
    draw: string,
    lose: string,
    point: string,
    section: string,
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
    matchList: matchList
}
