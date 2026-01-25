/**
 * API Football - 오늘 경기 정보 조회
 */

import { createApiFootballClient } from "../common/http-client";
import { extractNumericId, formatDateTime, formatDate, addDays, parseDate } from "../common/utils";
import { MatchDto, MatchStatus, ApiResponse, hasApiError } from "../common/types";
import { ApiFootballFixture } from "./dto";

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
 * 리그 ID, 시즌, 날짜를 받아 해당 날짜와 하루 전, 하루 후 경기 정보를 MatchDto 형태로 반환
 *
 * @param leagueId - 리그 ID (예: 'apifootball39' 또는 39)
 * @param season - 시즌 (예: 'apifootball2025' 또는 2025)
 * @param date - 조회할 날짜 (예: '2025-01-15' 또는 Date 객체)
 * @returns MatchDto 형태의 경기 정보 리스트 (date-1, date, date+1의 3일간)
 */
export async function apiFootballMatchToday(
    leagueId: string | number,
    season: string | number,
    date: string | Date
): Promise<MatchDto[] | null> {
    const numericLeagueId = extractNumericId(leagueId);

    if (!season) {
        throw new Error("season is required");
    }

    const numericSeason = extractNumericId(season);
    const originalSeason = typeof season === "string"
        ? season
        : `apifootball${season}`;

    if (!date) {
        throw new Error("date is required");
    }

    const targetDate = parseDate(date);
    const dateFrom = formatDate(addDays(targetDate, -1));
    const dateTo = formatDate(addDays(targetDate, 1));

    const client = createApiFootballClient();

    try {
        // 2. 날짜 범위의 경기 조회
        const fixturesData = await client.get<ApiResponse<ApiFootballFixture[]>>("/fixtures", {
            league: numericLeagueId,
            season: numericSeason,
            from: dateFrom,
            to: dateTo
        });

        if (hasApiError(fixturesData) || !fixturesData.response) {
            console.log("⚠️ 경기 조회 실패");
            return [];
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        console.error("API 요청 실패: api-football-match-today");
        return null;
    }
}
