/**
 * PandaScore - DTO 타입 정의
 */

// PandaScore Series
export interface PandaScoreSeries {
  id: number;
  name: string;
  full_name?: string;
  begin_at?: string;
  end_at?: string;
  league?: {
    name: string;
  };
}

// PandaScore League
export interface PandaScoreLeague {
  id: number;
  name: string;
  slug?: string;
  image_url?: string;
  series: PandaScoreSeries[];
}

// PandaScore Tournament
export interface PandaScoreTournament {
  id: number;
  name: string;
}

// PandaScore Team
export interface PandaScoreTeam {
  id: number;
  name: string;
  acronym?: string;
}

// PandaScore Opponent
export interface PandaScoreOpponent {
  opponent?: PandaScoreTeam;
}

// PandaScore Result
export interface PandaScoreResult {
  score?: number;
}

// PandaScore Match
export interface PandaScoreMatch {
  id: number;
  scheduled_at?: string;
  status: string;
  winner_id?: number;
  opponents?: PandaScoreOpponent[];
  results?: PandaScoreResult[];
  name: string;
}

// PandaScore Standing
export interface PandaScoreStanding {
  rank?: number;
  team?: PandaScoreTeam;
  wins?: number;
  losses?: number;
  draws?: number;
  points?: number;
  group?: string;
}

// PandaScore Roster
export interface PandaScoreRoster {
  id: number;
  name: string;
  acronym?: string;
  image_url?: string;
  location?: string;
}

// PandaScore Rosters 응답
export interface PandaScoreRostersResponse {
  rosters?: PandaScoreRoster[];
}

// 국가 코드 맵
export const PANDASCORE_COUNTRY_MAP: Record<string, string> = {
  lck: "KR",
  lpl: "CN",
  lec: "EU",
  lcs: "US",
  cblol: "BR",
  ljl: "JP",
  lcl: "AR",
  world: "XW"
};
