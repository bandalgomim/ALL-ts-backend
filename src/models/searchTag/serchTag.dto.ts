interface searchTagDto {
    teamId: number | null,
    leagueId: number | null,
    tag: string,
    itemName: string
}
export type searchTagResDto = searchTagDto[];
