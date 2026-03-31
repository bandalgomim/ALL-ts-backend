export type translatorDto = {
  homeTeamId: string;
  awayTeamId: string;
  url: string;
  date: string;
  type: string;
  platformId: string;
  leagueId: string;
  doubleHeader: number;
  matchId: string | null;
};

export interface translatorListDto {
  translatorList: translatorDto[];
  [Symbol.iterator](): Iterator<translatorDto>;
}
