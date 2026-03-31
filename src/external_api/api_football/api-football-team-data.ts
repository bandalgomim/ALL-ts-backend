/**
 * API Football - 팀 데이터 조회 (standings 제거 버전)
 */

import { createApiFootballClient } from "../common/http-client";
import { extractNumericId, getCountryCode } from "../common/utils";
import { type TeamDto, type ApiResponse, hasApiError } from "../common/types";
import { type ApiFootballLeague } from "./dto";
import { getTeamInfos } from "./api-football-utils";

/**
 * 리그 ID를 받아 해당 리그의 팀 정보를 TeamDto 형태로 반환 (Teams API 기반)
 *
 * @param leagueId - 리그 ID (예: 'apifootball39' 또는 39)
 * @returns TeamDto 형태의 팀 정보 리스트
 */
export async function apiFootballTeamData(leagueId: string | number): Promise<TeamDto[] | null> {
  const numericId = extractNumericId(leagueId);
  const client = createApiFootballClient();

  try {
    // 1) 리그 정보 조회 (현재 시즌/리그 국가코드 fallback 확보)
    const leagueData = await client.get<ApiResponse<ApiFootballLeague[]>>("/leagues", {
      id: numericId,
      current: "true"
    });

    if (hasApiError(leagueData) || !leagueData.response?.length) {
      console.log("❌ 리그 정보 조회 실패");
      return [];
    }

    const leagueInfo = leagueData.response[0];
    const seasons = leagueInfo.seasons || [];

    // 현재 시즌 찾기
    let currentSeason = 2025;
    for (const s of seasons) {
      if (s.current) {
        currentSeason = s.year;
        break;
      }
    }

    // 리그 국가 코드(팀 country가 World/비어있을 때 fallback)
    // (dto 구조에 따라 country.code 또는 country.flag가 있을 수 있음)
    const leagueCountryCode =
      (leagueInfo as any)?.country?.code?.toUpperCase?.() ||
      ((leagueInfo as any)?.country?.flag
        ? String((leagueInfo as any).country.flag)
            .split("/")
            .pop()
            ?.replace(".svg", "")
            .toUpperCase()
        : "") ||
      "";

    // 2) Teams API로 팀 목록 조회 (standings 제거)
    const teamsData = await getTeamInfos(numericId, currentSeason, client);

    if (hasApiError(teamsData) || !teamsData?.length) {
      console.log("⚠️ 팀 목록 조회 실패");
      return [];
    }

    // 3) TeamDto 생성 (중복 제거)
    const teamDict: Record<number, TeamDto> = {};

    for (const item of teamsData) {
      const team = item.team;
      const teamId = team?.id;
      if (!teamId) continue;

      const teamCountry = team.country || "";
      const countryId =
        teamCountry && teamCountry !== "World" ? getCountryCode(teamCountry) : leagueCountryCode;

      teamDict[teamId] = {
        teamId: `apifootball${teamId}`,
        teamName: team.name,
        teamInitial: team.code || null,
        teamLogo: team.logo || null,
        sportId: 3,
        countryId: countryId || ""
      };
    }

    return Object.values(teamDict);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error("API 요청 실패: api-football-team-data");
    return null;
  }
}
