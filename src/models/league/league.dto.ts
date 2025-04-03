import { match } from "../main/main.dto";

export interface league {
    leagueId: number,
    leagueName: string,
    leagueLogo: string,
    sportId: number,
    sportName: string,
    countryId: number,
    countryName: string,
    isSelected: boolean
}

export interface team {
    teamId: number,
    teamName: string,
    teamInit: string,
    teamLogo: string
}

export interface getLeagueDto {
    league: league,
    teamList: team[],
    matchList: match[]
}

export { match };

