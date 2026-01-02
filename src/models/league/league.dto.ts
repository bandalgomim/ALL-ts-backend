import { matchList } from "@models/main/main.dto";

export interface league {
    leagueId: number,
    leagueName: string,
    leagueInit: string,
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
    teamLogo: string,
    rank: string,
    win: string,
    draw: string,
    lose: string,
    point: string,
    section: string,
    sectionIdx: number
}

export interface getLeagueDto {
    league: league,
    teamList: team[],
    matchList: matchList
}

export { matchList };

