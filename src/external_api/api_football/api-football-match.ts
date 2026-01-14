/**
 * API Football - 경기 정보 조회
 */

import { createApiFootballClient } from "../common/http-client";
import { extractNumericId, formatDateTime } from "../common/utils";
import { MatchDto, MatchStatus, ApiResponse, hasApiError } from "../common/types";
import { ApiFootballFixture, ApiFootballLeague } from "./dto";

/**
 * API Football 상태를 MatchStatus로 변환
 */
function convertApiFootballStatus(apiStatus: string): MatchStatus {
    if ([ "FT", "AET", "PEN" ].includes(apiStatus)) {
        return "end";
    } else if ([ "LIVE", "1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT" ].includes(apiStatus)) {
        return "live";
    } else if ([ "NS", "TBD" ].includes(apiStatus)) {
        return "next";
    } else {
        return "off";
    }
}

/**
 * 리그 ID와 시즌을 받아 해당 시즌의 모든 경기 정보를 MatchDto 형태로 반환
 *
 * @param leagueId - 리그 ID (예: 'apifootball39' 또는 39)
 * @param season - 시즌 ID (예: 'apifootball2025' 또는 2025)
 * @returns MatchDto 형태의 모든 경기 정보 리스트
 */
export async function apiFootballMatchInfo(
    leagueId: string | number,
    season: string | number
): Promise<MatchDto[] | null> {
    const numericLeagueId = extractNumericId(leagueId);

    if (!season) {
        throw new Error("season is required");
    }

    const numericSeason = extractNumericId(season);
    const originalSeason = typeof season === "string"
        ? season
        : `apifootball${season}`;

    const client = createApiFootballClient();

    try {
    // 1. 리그 정보 조회
        const leagueData = await client.get<ApiResponse<ApiFootballLeague[]>>("/leagues", {
            id: numericLeagueId,
            season: numericSeason
        });

        if (hasApiError(leagueData) || !leagueData.response?.length) {
            console.log("❌ 리그 정보 조회 실패");
            return null;
        }


        // 2. 해당 시즌의 모든 경기 조회
        const fixturesData = await client.get<ApiResponse<ApiFootballFixture[]>>("/fixtures", {
            league: numericLeagueId,
            season: numericSeason
        });

        if (hasApiError(fixturesData) || !fixturesData.response) {
            console.log("⚠️ 경기 조회 실패");
            return null;
        }

        const fixtures = fixturesData.response;
        const allMatches: MatchDto[] = [];

        // 경기 정보를 MatchDto 형태로 가공
        for (const fixtureData of fixtures) {
            const fixture = fixtureData.fixture;
            const teams = fixtureData.teams;
            const goals = fixtureData.goals;

            const dateTime = formatDateTime(fixture.date);
            const homeTeamId = teams.home.id ? `apifootball${teams.home.id}` : "";
            const awayTeamId = teams.away.id ? `apifootball${teams.away.id}` : "";
            const status = convertApiFootballStatus(fixture.status.short);

            const matchInfo: MatchDto = {
                date: dateTime,
                status,
                homeTeamId,
                awayTeamId,
                homeTeamScore: goals.home || 0,
                awayTeamScore: goals.away || 0,
                leagueId: `apifootball${numericLeagueId}`,
                doubleHeader: 0,
                matchId: fixture.id ? `apifootball${fixture.id}` : "",
                seasonId: originalSeason
            };

            allMatches.push(matchInfo);
        }


        return allMatches;

    } catch (error) {
        console.error("API 요청 실패:", error);
        return null;
    }
}
