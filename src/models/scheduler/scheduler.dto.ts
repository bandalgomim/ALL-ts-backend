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
    doubleHeader: number
};
export type postSchedulerReqDto = {
    [league: string]: schedulerDto[],
    [Symbol.iterator](): Iterator<schedulerDto>
};
export type getSchedulerResDto = { league: string, start: string, end: string }[];

