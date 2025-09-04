export type translatorDto = {
    homeTeamId: string,
    awayTeamId: string,
    url: string,
    date: string,
    type: string,
    platformId: string,
    leagueId: string,
    doubleHeader: number,
    raw_output: string
};

export interface translatorListDto {
    translatorList: translatorDto[],
    [Symbol.iterator](): Iterator<translatorDto>
}
