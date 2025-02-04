export interface match {
    matchId: number,
    matchDate: string,
    homeTeamId: number,
    awayTeamId: number,
    teamicon: string
}

export interface team {
    teamId: number,
    teamName: string,
    teamIcon: string
}

export interface getMainDto {
    calander: match[],
    favorite: team[]
}
