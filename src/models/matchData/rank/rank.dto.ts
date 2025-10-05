export type rankDto =
{
    seasonId?: number,
    teamId: string,
    leagueId: string,
    rank: number | string,
    win: number | string,
    draw: number | string,
    lose: number | string,
    point: number | string,
    section: string | null
};
export type postRankReqDto = {
    [league: string]: rankDto[]
};
