export interface infoUpdateSeason {
    leagueId: string,
    leagueName: string,
    leagueInitial: string | null,
    leagueLogo: string,
    sportId: number,
    countryId: string,
    seasonId: string,
    seasonName: string,
    seasonStart: string,
    seasonEnd: string,
}

export interface infoUpdateTeam {
    teamId: string,
    teamName: string,
    teamInitial: string | null,
    teamLogo: string,
    sportId: number,
    countryId: string
}
