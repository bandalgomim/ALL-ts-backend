export type patchRankDto = {
  seasonId?: string;
  teamId: string;
  leagueId: string;
  rank: number | string;
  win: number | string;
  draw: number | string;
  lose: number | string;
  point: number | string;
  section: string | null;
  sectionIdx: number | null;
};
export type patchRankReqDto = {
  [league: string]: patchRankDto[];
};
