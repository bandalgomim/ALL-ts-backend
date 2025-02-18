export interface platform {
    platformId: number,
    platformName: string,
    platformlogo: string,
    platformUrl: string
}

export interface getMatchDto {
    matchId: number,
    matchDate: string,
    homeTeamId: number,
    awayTeamId: number,
    hometeamLogo: string,
    awayteamLogo: string,
    homeTeamScore: number,
    awayTeamScore: number,
    matchState: string,
    isMatchSelected: boolean,
    platform: platform[]
}
