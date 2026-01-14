/**
 * PandaScore - 팀 데이터 조회
 */

import { createPandaScoreClient } from "../common/http-client";
import { extractNumericId } from "../common/utils";
import { TeamDto } from "../common/types";
import {
    PandaScoreLeague,
    PandaScoreTournament,
    PandaScoreRoster,
    PandaScoreRostersResponse
} from "./dto";

/**
 * 리그 ID를 받아 해당 리그의 팀 정보를 TeamDto 형태로 반환
 *
 * @param leagueId - 리그 ID (예: 'pandascore293' 또는 293)
 * @returns TeamDto 형태의 팀 정보 리스트
 */
export async function pandaScoreTeamData(
    leagueId: string | number
): Promise<TeamDto[] | null> {
    const numericId = extractNumericId(leagueId);
    const client = createPandaScoreClient();

    try {
    // 1. 리그 정보 조회
        const leagueData = await client.get<PandaScoreLeague>(`/leagues/${numericId}`, {
            "page[size]": 100
        });

        const series = leagueData.series[leagueData.series.length - 1];
        const seriesId = series.id;

        // 2. 토너먼트 조회 (running -> upcoming -> past)
        let tournaments: PandaScoreTournament[] = [];

        // 진행 중인 토너먼트
        tournaments = await client.get<PandaScoreTournament[]>("/tournaments/running", {
            "filter[serie_id]": seriesId,
            "page[size]": 100,
            sort: "-begin_at"
        });

        // 없으면 예정된 토너먼트
        if (!tournaments.length) {
            tournaments = await client.get<PandaScoreTournament[]>("/tournaments/upcoming", {
                "filter[serie_id]": seriesId,
                "page[size]": 100,
                sort: "begin_at"
            });
        }

        // 그것도 없으면 종료된 토너먼트
        if (!tournaments.length) {
            tournaments = await client.get<PandaScoreTournament[]>("/tournaments/past", {
                "filter[serie_id]": seriesId,
                "page[size]": 100,
                sort: "-end_at"
            });
        }

        // 3. 모든 토너먼트의 로스터에서 팀 정보 추출 (중복 제거)
        const teamDict: Record<number, TeamDto> = {};

        for (const tournament of tournaments) {
            const tournamentId = tournament.id;
            const tournamentName = tournament.name || "";

            try {
                const rostersResponse = await client.get<PandaScoreRostersResponse | PandaScoreRoster[]>(
                    `/tournaments/${tournamentId}/rosters`,
                    { "page[size]": 100 }
                );

                // rosters 배열 추출
                const rosters = Array.isArray(rostersResponse)
                    ? rostersResponse
                    : rostersResponse.rosters || [];

                for (const roster of rosters) {
                    const teamId = roster.id;

                    if (!teamId) continue;

                    const teamInfo: TeamDto = {
                        teamId: `pandascore${teamId}`,
                        teamName: roster.name,
                        teamInitial: roster.acronym || null,
                        teamLogo: roster.image_url || null,
                        sportId: 1,
                        countryId: roster.location || null
                    };

                    teamDict[teamId] = teamInfo;
                }

            } catch (error) {
                console.error(`⚠️ 토너먼트 ${tournamentId} 로스터 조회 실패:`, error);
                continue;
            }
        }
        return Object.values(teamDict);

    } catch (error) {
        console.error("API 요청 실패:", error);
        return null;
    }
}
