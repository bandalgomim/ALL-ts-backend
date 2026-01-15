export type schedulerDto =
{
    date: string,
    status: string,
    homeTeamId: number | string,
    awayTeamId: number | string,
    homeTeamScore: number | string,
    awayTeamScore: number | string,
    leagueId: number | string,
    doubleHeader: number,
    matchId?: string,
    seasonId?: number
};

