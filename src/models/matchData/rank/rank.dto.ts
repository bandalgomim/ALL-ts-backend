export type rankDto =
{
    teamId: string,
    leagueId: number,
    rank: number | string,
    win: number | string,
    draw: number | string,
    rose: number | string,
    point: number | string,
    section: string | null
};
export type postRankReqDto = {
    [league: string]: rankDto[]
};
