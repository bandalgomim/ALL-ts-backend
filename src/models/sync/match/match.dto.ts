export type patchMatchDto = {
  date: string;
  status: string;
  homeTeamId: number | string;
  awayTeamId: number | string;
  homeTeamScore: number | string;
  awayTeamScore: number | string;
  leagueId: number | string;
  doubleHeader: number;
  matchId?: string;
  seasonId?: string;
};

export type postBatchSchedulerReqDto = {
  matchList: patchMatchDto;
  isLast: boolean;
};

export type getSchedulerResDto = { league: string; start: string; end: string }[];
