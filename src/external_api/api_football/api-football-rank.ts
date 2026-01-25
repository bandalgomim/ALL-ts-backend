import { createApiFootballClient } from "../common/http-client";
import { extractNumericId } from "../common/utils";
import { RankDto, ApiResponse, hasApiError } from "../common/types";
import { ApiFootballStanding, ApiFootballStandingsResponse } from "./dto";
import { getCurrentRound } from "./api-football-utils";

function mergeAllGroupsWithPriority(
    roundName: string | null,
    allStandings: ApiFootballStanding[][]
): ApiFootballStanding[][] {
    if (allStandings.length <= 1) {
        return allStandings;
    }

    const prioritizedGroups: ApiFootballStanding[][] = [];
    const otherGroups: ApiFootballStanding[][] = [];

    if (roundName) {
        for (const group of allStandings) {
            if (group && group.length > 0) {
                const groupName = group[0]?.group || "";
                if (groupName) {
                    const groupLower = groupName.toLowerCase();
                    const roundLower = roundName.toLowerCase();

                    // 공통 키워드 추출
                    const groupKeywords = new Set(
                        groupLower.replace(",", " ").split(" ")
                            .filter((word) => /^[a-z]+$/.test(word) && word.length > 2)
                    );
                    const roundKeywords = new Set(
                        roundLower.replace("-", " ").split(" ")
                            .filter((word) => /^[a-z]+$/.test(word) && word.length > 2)
                    );

                    // 현재 라운드와 매칭되면 우선순위 그룹
                    const common = [ ...groupKeywords ].filter((x) => roundKeywords.has(x));
                    if (common.length > 0 || roundName.includes(groupName) || groupName.includes(roundName)) {
                        prioritizedGroups.push(group);
                    } else {
                        otherGroups.push(group);
                    }
                } else {
                    otherGroups.push(group);
                }
            } else {
                otherGroups.push(group);
            }
        }
    } else {
        otherGroups.push(...allStandings);
    }

    return [ ...prioritizedGroups, ...otherGroups ];
}

/**
 * 리그 ID와 시즌을 받아 RankDto 형태로 순위 정보를 반환
 *
 * @param leagueId - 리그 ID (예: 'apifootball39' 또는 39)
 * @param season - 시즌 (예: 2025, 'apifootball2025' 또는 undefined - 현재 시즌 사용)
 * @returns RankDto 형태의 순위 정보 리스트
 */
export async function apiFootballRankInfo(
    leagueId: string | number,
    season?: string
): Promise<RankDto[] | null> {
    const numericLeagueId = extractNumericId(leagueId);
    const client = createApiFootballClient();

    try {
    // 1. 리그 정보 조회 (현재 시즌)

        // 시즌 결정
        const currentSeason = extractNumericId(season as string);

        // 2. 순위표 조회
        const standingsData = await client.get<ApiResponse<ApiFootballStandingsResponse[]>>("/standings", {
            league: numericLeagueId,
            season: currentSeason
        });

        if (hasApiError(standingsData) || !standingsData.response?.length) {
            return [];
        }

        const leagueStandings = standingsData.response[0].league;
        const allStandings = leagueStandings.standings;

        // 3. 현재 진행 중인 라운드 확인
        const currentRound = await getCurrentRound(numericLeagueId, currentSeason, client);

        // 4. 모든 그룹을 우선순위 정렬
        const sortedGroups = mergeAllGroupsWithPriority(currentRound, allStandings);

        // 5. 중복 제거하며 합치기
        const seenTeams = new Set<number>();
        const standingsList: ApiFootballStanding[] = [];

        for (const group of sortedGroups) {
            for (const standing of group) {
                const teamId = standing.team?.id;
                if (teamId && !seenTeams.has(teamId)) {
                    seenTeams.add(teamId);
                    standingsList.push(standing);
                }
            }
        }

        // section별로 팀을 그룹화
        const sectionTeams: Record<string, Array<[number, RankDto]>> = {};

        for (const standing of standingsList) {
            const teamId = standing.team?.id;
            const wins = standing.all.win;
            const draws = standing.all.draw;
            const losses = standing.all.lose;
            const points = standing.points;
            const rank = standing.rank;
            const section = standing.group || null;

            const rankInfo: RankDto = {
                seasonId: `apifootball${currentSeason}`,
                teamId: `apifootball${teamId}`,
                leagueId: `apifootball${numericLeagueId}`,
                rank,
                win: wins,
                draw: draws,
                lose: losses,
                point: points,
                section,
                sectionIdx: null
            };

            const sectionKey = section || "default";
            if (!sectionTeams[sectionKey]) {
                sectionTeams[sectionKey] = [];
            }
            sectionTeams[sectionKey].push([ rank || 999, rankInfo ]);
        }

        // section을 알파벳 역순으로 정렬
        const sortedSections = Object.keys(sectionTeams).sort()
            .reverse();

        // sectionIdx 할당
        const allRanks: RankDto[] = [];
        let idx = 1;

        for (const section of sortedSections) {
            const teams = sectionTeams[section];
            teams.sort((a, b) => a[0] - b[0]);

            for (const [ , rankInfo ] of teams) {
                rankInfo.sectionIdx = idx;
                allRanks.push(rankInfo);
            }
            idx++;
        }

        return allRanks;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        console.error("API 요청 실패: api-football-rank");
        return null;
    }
}
