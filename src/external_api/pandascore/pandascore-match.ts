/**
 * PandaScore - 경기 정보 조회
 */

import { createPandaScoreClient } from "../common/http-client";
import { extractNumericId, formatDateTime } from "../common/utils";
import { type MatchDto, type MatchStatus } from "../common/types";
import { type PandaScoreTournament, type PandaScoreMatch } from "./dto";

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
 * 리그 ID와 시리즈 ID를 받아 해당 시리즈의 모든 토너먼트의 경기 정보를 MatchDto 형태로 반환
 *
 * @param leagueId - 리그 ID (예: 'pandascore294' 또는 294)
 * @param seriesId - 시리즈 ID (필수)
 * @returns MatchDto 형태의 모든 경기 정보 리스트
 */
export async function pandaScoreMatchInfo(
  leagueId: string | number,
  seriesId: string | number
): Promise<MatchDto[] | null> {
  const numericLeagueId = extractNumericId(leagueId);

  if (!seriesId) {
    throw new Error("seriesId is required");
  }

  const numericSeriesId = extractNumericId(seriesId);
  const client = createPandaScoreClient();

  try {
    // 1. 시리즈 정보 직접 조회

    // 2. 해당 시리즈의 모든 토너먼트 조회
    const allTournaments: PandaScoreTournament[] = [];

    // 진행 중인 토너먼트
    const runningTournaments = await client.get<PandaScoreTournament[]>("/tournaments/running", {
      "filter[serie_id]": numericSeriesId,
      "page[size]": 100,
      sort: "-begin_at"
    });
    allTournaments.push(...runningTournaments);

    // 예정된 토너먼트
    const upcomingTournaments = await client.get<PandaScoreTournament[]>("/tournaments/upcoming", {
      "filter[serie_id]": numericSeriesId,
      "page[size]": 100,
      sort: "begin_at"
    });
    allTournaments.push(...upcomingTournaments);

    // 종료된 토너먼트
    const pastTournaments = await client.get<PandaScoreTournament[]>("/tournaments/past", {
      "filter[serie_id]": numericSeriesId,
      "page[size]": 100,
      sort: "-end_at"
    });
    allTournaments.push(...pastTournaments);

    // 3. 모든 토너먼트의 경기 정보 수집
    const allMatches: MatchDto[] = [];

    for (const tournament of allTournaments) {
      const tournamentId = tournament.id;

      try {
        let page = 1;
        const tournamentMatches: MatchDto[] = [];

        while (true) {
          const matches = await client.get<PandaScoreMatch[]>(
            `/tournaments/${tournamentId}/matches`,
            { "page[size]": 100, page }
          );

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

            tournamentMatches.push(matchInfo);
          }

          if (matches.length < 100) break;
          page++;
        }

        allMatches.push(...tournamentMatches);
      } catch (error) {
        console.error(`❌ 토너먼트 ${tournamentId} 경기 조회 실패:`, error);
        continue;
      }
    }
    return allMatches;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error("API 요청 실패: pandascore-match");
    return null;
  }
}
