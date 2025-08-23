export type translatorDto = {
    homeTeam: string,
    awayTeam: string,
    url: string,
    date: string,
    dh: number,
    type: string,
    platform: string,
    leagueId: string,
    raw_output: string
};

export interface translatorListDto {
    translatorList: translatorDto[],
    [Symbol.iterator](): Iterator<translatorDto>
}
