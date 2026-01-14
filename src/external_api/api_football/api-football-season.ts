/**
 * API Football - 시즌 정보 조회
 */

import { createApiFootballClient } from "../common/http-client";
import { extractNumericId, getCountryCode } from "../common/utils";
import { SeasonDto, ApiResponse, hasApiError } from "../common/types";
import { ApiFootballLeague } from "./dto";

/**
 * 리그 ID를 받아 시즌 정보를 SeasonDto 형태로 반환
 *
 * @param leagueId - 리그 ID (예: 'apifootball39' 또는 39)
 * @returns SeasonDto 형태의 시즌 정보
 */
export async function apiFootballSeasonInfo(
    leagueId: string | number
): Promise<SeasonDto | null> {
    const numericId = extractNumericId(leagueId);
    const client = createApiFootballClient();

    try {
    // 1. 리그 정보 조회 (현재 시즌)
        const leagueData = await client.get<ApiResponse<ApiFootballLeague[]>>("/leagues", {
            id: numericId,
            current: "true"
        });

        if (hasApiError(leagueData) || !leagueData.response?.length) {
            return null;
        }

        const leagueInfo = leagueData.response[0];
        const league = leagueInfo.league;
        const leagueCountry = leagueInfo.country?.name || "";
        const seasons = leagueInfo.seasons || [];
        const countryCode = getCountryCode(leagueCountry);

        // 현재 시즌 찾기
        let currentSeason: number | null = null;
        let currentSeasonStart: string | null = null;
        let currentSeasonEnd: string | null = null;

        for (const s of seasons) {
            if (s.current) {
                currentSeason = s.year;
                currentSeasonStart = s.start ?? null;
                currentSeasonEnd = s.end ?? null;
                break;
            }
        }

        // current 플래그가 없으면 연도 기준 정렬하여 가장 최근 시즌 선택
        if (!currentSeason && seasons.length > 0) {
            const sortedSeasons = [ ...seasons ].sort((a, b) => b.year - a.year);
            currentSeason = sortedSeasons[0].year;
            currentSeasonStart = sortedSeasons[0].start ?? null;
            currentSeasonEnd = sortedSeasons[0].end ?? null;
        }

        const result: SeasonDto = {
            leagueId: `apifootball${numericId}`,
            leagueName: league.name,
            leagueInitial: null,
            leagueLogo: league.logo ?? null,
            sportId: 3,
            countryId: countryCode,
            seasonId: `apifootball${currentSeason}`,
            seasonName: `${league.name} ${currentSeason}`,
            seasonStart: currentSeasonStart,
            seasonEnd: currentSeasonEnd
        };

        return result;

    } catch (error) {
        console.error("API 요청 실패:", error);
        return null;
    }
}
