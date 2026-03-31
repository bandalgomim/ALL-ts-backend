/**
 * 공통 타입 정의
 */

// 경기 상태 enum
export type MatchStatus = "end" | "live" | "next" | "off";

// 경기 정보 DTO
export interface MatchDto {
  date: string;
  status: MatchStatus;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamScore: number;
  awayTeamScore: number;
  leagueId: string;
  doubleHeader: number;
  matchId: string;
  seasonId: string;
}

// 순위 정보 DTO
export interface RankDto {
  seasonId: string;
  teamId: string;
  leagueId: string;
  rank: number | string | null;
  win: number;
  draw: number | string;
  lose: number;
  point: number | null;
  section: string | null;
  sectionIdx: number | null;
}

// 시즌 정보 DTO
export interface SeasonDto {
  leagueId: string;
  leagueName: string;
  leagueInitial: string | null;
  leagueLogo: string | null;
  sportId: number;
  countryId: string | null;
  seasonId: string;
  seasonName: string;
  seasonStart: string | null;
  seasonEnd: string | null;
}

// 팀 정보 DTO
export interface TeamDto {
  teamId: string;
  teamName: string;
  teamInitial: string | null;
  teamLogo: string | null;
  sportId: number;
  countryId: string | null;
}

// API 응답 타입
export interface ApiResponse<T> {
  errors?: Record<string, unknown> | unknown[];
  response?: T;
  results?: number;
}

/**
 * API 응답에 에러가 있는지 확인
 */
export function hasApiError(response: ApiResponse<unknown>): boolean {
  if (!response.errors) return false;
  if (Array.isArray(response.errors)) return response.errors.length > 0;
  return Object.keys(response.errors).length > 0;
}
