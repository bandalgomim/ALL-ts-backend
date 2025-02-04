interface match {
    matchId: number,
    matchDate: string,
    homeTeamId: number,
    awayTeamId: number,
    teamicon: string
}

interface team {
    teamId: number,
    teamName: string,
    teamIcon: string
}

export interface getMainDto {
    calander: match[],
    favorite: team[]
}

export interface deleteMatchMainDto {
    matchId: number
}
