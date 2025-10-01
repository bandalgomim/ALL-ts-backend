export type schedulerDto =
{
    date: string,
    time: string,
    status: string,
    homeTeamId: number | string,
    awayTeamId: number | string,
    homeTeamScore: number | string,
    awayTeamScore: number | string,
    leagueId: number | string,
    doubleHeader: number,
    matchId?: string
};
export type postSchedulerReqDto = {
    [league: string]: schedulerDto[]
};

export type postBatchSchedulerReqDto = {
    matchList: postSchedulerReqDto,
    isLast: boolean
};

export type getSchedulerResDto = { league: string, start: string, end: string }[];

