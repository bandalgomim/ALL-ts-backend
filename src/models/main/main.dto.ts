export interface match {
    matchId: number,
    matchDate: string,
    homeTeamId: number,
    awayTeamId: number,
    hometeamLogo: string,
    awayteamLogo: string,
    matchState: string,
    isMatchSelected: boolean
}

export interface team {
    teamId: number,
    teamName: string,
    teamLogo: string
}

export interface getMainDto {
    calander: match[],
    favorite: team[]
}
