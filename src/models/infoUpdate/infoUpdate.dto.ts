export interface teamInfo {
    teamId: number,
    teamName: string,
    teamInit: string,
    teamLogo: string,
    sportId: string,
    countryId: string
}

export interface infoUpdate {
    leagueId: number,
    leagueLogo: string,
    seasonId: number,
    seasonName: string,
    teamInfo: teamInfo[]
}
