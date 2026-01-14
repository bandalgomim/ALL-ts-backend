/**
 * PandaScore - 오늘 경기 정보 조회
 */

import { createPandaScoreClient } from "../common/http-client";
import { extractNumericId, formatDateTime, parseDate, addDays } from "../common/utils";
import { MatchDto, MatchStatus } from "../common/types";
import { PandaScoreMatch } from "./dto";

/**
 * PandaScore 상태를 MatchStatus로 변환
 */
function convertPandaScoreStatus(status: string): MatchStatus {
    switch (status) {
        case "finished":
            return "end";
        case "running":
            return "live";
        case "not_started":
            return "next";
        default:
            return "off";
    }
}

/**
 * 리그 ID, 시리즈 ID, 날짜를 받아 해당 날짜와 하루 전, 하루 후 경기 정보를 MatchDto 형태로 반환
 *
 * @param leagueId - 리그 ID (예: 'pandascore294' 또는 294)
 * @param seriesId - 시리즈 ID (필수)
 * @param date - 조회할 날짜 (예: '2025-01-15' 또는 Date 객체)
 * @returns MatchDto 형태의 경기 정보 리스트 (date-1, date, date+1의 3일간)
 */
export async function pandaScoreMatchToday(
    leagueId: string | number,
    seriesId: string | number,
    date: string | Date
): Promise<MatchDto[] | null> {
    const numericLeagueId = extractNumericId(leagueId);

    if (!seriesId) {
        throw new Error("seriesId is required");
    }

    const numericSeriesId = extractNumericId(seriesId);

    if (!date) {
        throw new Error("date is required");
    }

    const targetDate = parseDate(date);

    // 날짜 범위 계산: date-1부터 date+1까지
    const dateFrom = addDays(targetDate, -1);
    dateFrom.setHours(0, 0, 0, 0);

    const dateTo = addDays(targetDate, 1);
    dateTo.setHours(23, 59, 59, 0);

    const dateFromStr = dateFrom.toISOString().replace(".000Z", "Z");
    const dateToStr = dateTo.toISOString().replace(".000Z", "Z");

    const client = createPandaScoreClient();

    try {
    // 1. 시리즈 정보 직접 조회

        // 2. 날짜 범위의 경기 조회
        const allMatches: MatchDto[] = [];
        let page = 1;

        while (true) {

            const matches = await client.get<PandaScoreMatch[]>("/matches", {
                "filter[serie_id]": numericSeriesId,
                "range[begin_at]": `${dateFromStr},${dateToStr}`,
                "page[size]": 100,
                "page[number]": page,
                sort: "begin_at"
            });

            if (!matches || matches.length === 0) break;

            for (const match of matches) {
                const dateTime = formatDateTime(match.scheduled_at || "");

                // 상대팀 정보 추출
                const opponents = match.opponents || [];
                const homeTeamId = opponents[0]?.opponent?.id
                    ? `pandascore${opponents[0].opponent.id}`
                    : "";
                const awayTeamId = opponents[1]?.opponent?.id
                    ? `pandascore${opponents[1].opponent.id}`
                    : "";

                // 스코어 추출
                const results = match.results || [];
                const homeTeamScore = results[0]?.score || 0;
                const awayTeamScore = results[1]?.score || 0;

                const status = convertPandaScoreStatus(match.status);

                const matchInfo: MatchDto = {
                    date: dateTime,
                    status,
                    homeTeamId,
                    awayTeamId,
                    homeTeamScore,
                    awayTeamScore,
                    leagueId: `pandascore${numericLeagueId}`,
                    doubleHeader: 0,
                    matchId: match.id ? `pandascore${match.id}` : "",
                    seasonId: `pandascore${numericSeriesId}`
                };

                allMatches.push(matchInfo);
            }

            if (matches.length < 100) break;
            page++;
        }
        return allMatches;

    } catch (error) {
        console.error("API 요청 실패:", error);
        return null;
    }
}
