/**
 * PandaScore - 순위 정보 조회
 */

import { createPandaScoreClient } from "../common/http-client";
import { extractNumericId } from "../common/utils";
import { type RankDto } from "../common/types";
import {
  type PandaScoreSeries,
  type PandaScoreTournament,
  type PandaScoreTeam,
  type PandaScoreStanding,
  type PandaScoreMatch
} from "./dto";

interface MatchStats {
  wins: number;
  losses: number;
}

interface SectionInfo {
  section: string | null;
  sectionIdx: number | null;
}

function determineSection(
  seriesName: string,
  tournamentName: string,
  teamAcronym: string | undefined,
  defaultSection: string | null
): SectionInfo {
  if (seriesName.includes("Cup") && tournamentName === "Group Stage") {
    if (teamAcronym && ["GEN", "T1", "NS", "DNS", "BRO"].includes(teamAcronym)) {
      return { section: "GROUP BARON", sectionIdx: -1 };
    } else {
      return { section: "GROUP ELDER", sectionIdx: -2 };
    }
  } else if (["Play-In", "Knights Rivals"].includes(tournamentName)) {
    return { section: tournamentName, sectionIdx: 0 };
  } else if (["Playoffs"].includes(tournamentName)) {
    return { section: tournamentName, sectionIdx: 1 };
  } else if (["Group Ascend"].includes(tournamentName)) {
    return { section: tournamentName, sectionIdx: -1 };
  } else if (["Group Perseverance"].includes(tournamentName)) {
    return { section: tournamentName, sectionIdx: -2 };
  } else if (["Group Nirvana"].includes(tournamentName)) {
    return { section: tournamentName, sectionIdx: -3 };
  }
  return { section: defaultSection, sectionIdx: null };
}

function createRankDto(
  numericSeriesId: number,
  teamId: number,
  numericLeagueId: number,
  rank: number | string | null,
  wins: number,
  losses: number,
  points: number,
  section: string | null,
  sectionIdx: number | null
): RankDto {
  return {
    seasonId: `pandascore${numericSeriesId}`,
    teamId: `pandascore${teamId}`,
    leagueId: `pandascore${numericLeagueId}`,
    rank,
    win: wins,
    draw: "-",
    lose: losses,
    point: points,
    section,
    sectionIdx
  };
}

function addToSectionTeams(
  sectionTeams: Record<string, Array<[number, RankDto]>>,
  sectionKey: string,
  rank: number | string | null | undefined,
  rankInfo: RankDto
): void {
  if (!sectionTeams[sectionKey]) {
    sectionTeams[sectionKey] = [];
  }
  const rankNumber = typeof rank === "number" ? rank : 999;
  sectionTeams[sectionKey].push([rankNumber, rankInfo]);
}

async function collectMatchStats(
  client: ReturnType<typeof createPandaScoreClient>,
  tournamentId: number
): Promise<{
  matchStats: Record<number, MatchStats>;
  teamInfoFromMatches: Record<number, PandaScoreTeam>;
}> {
  const matchStats: Record<number, MatchStats> = {};
  const teamInfoFromMatches: Record<number, PandaScoreTeam> = {};
  let page = 1;

  while (true) {
    try {
      const matches = await client.get<PandaScoreMatch[]>(`/tournaments/${tournamentId}/matches`, {
        "page[size]": 100,
        "page[number]": page
      });
      if (!matches || matches.length === 0) break;

      for (const match of matches) {
        const winnerId = match.winner_id;
        const opponents = match.opponents || [];

        for (const opp of opponents) {
          const opponent = opp.opponent;
          if (!opponent?.id) continue;

          const tid = opponent.id;

          if (!teamInfoFromMatches[tid]) {
            teamInfoFromMatches[tid] = opponent;
          }
          if (!matchStats[tid]) {
            matchStats[tid] = { wins: 0, losses: 0 };
          }

          if (winnerId) {
            if (tid === winnerId) {
              matchStats[tid].wins++;
            } else {
              matchStats[tid].losses++;
            }
          }
        }
      }

      if (matches.length < 100) break;
      page++;
    } catch {
      break;
    }
  }

  return { matchStats, teamInfoFromMatches };
}

async function processStandingsData(
  client: ReturnType<typeof createPandaScoreClient>,
  tournamentId: number,
  matchStats: Record<number, MatchStats>,
  sectionTeams: Record<string, Array<[number, RankDto]>>,
  seriesName: string,
  tournamentName: string,
  numericSeriesId: number,
  numericLeagueId: number
): Promise<boolean> {
  let standingsData: PandaScoreStanding[];
  let needsMatches: boolean;

  try {
    standingsData = await client.get<PandaScoreStanding[]>(
      `/tournaments/${tournamentId}/standings`,
      { "page[size]": 100 }
    );

    needsMatches =
      standingsData.some((s) => (s.wins || 0) === 0 && (s.losses || 0) === 0) ||
      standingsData.length <= 10;
  } catch {
    return false; // standings를 가져올 수 없으면 false 반환
  }

  // standings 데이터가 없거나 매치 데이터가 필요하면 false 반환
  if (!standingsData.length || needsMatches) {
    return false;
  }

  for (const standing of standingsData) {
    const team = standing.team;
    const teamId = team?.id;
    const teamInit = team?.acronym;

    if (!teamId) continue;

    let section = standing.group || tournamentName || null;

    // LCK Cup의 경우 특정 팀들을 바론/엘더 그룹으로 분리
    const sectionInfo = determineSection(seriesName, tournamentName, teamInit, section);
    section = sectionInfo.section;
    const sectionIdx = sectionInfo.sectionIdx;

    let wins = standing.wins || 0;
    let losses = standing.losses || 0;

    // standings에 정보가 없으면 matches 집계 사용
    if (wins === 0 && losses === 0 && matchStats[teamId]) {
      wins = matchStats[teamId].wins;
      losses = matchStats[teamId].losses;
    }

    const points = standing.points ?? wins - losses;
    const rank = standing.rank;

    const rankInfo = createRankDto(
      numericSeriesId,
      teamId,
      numericLeagueId,
      rank || null,
      wins,
      losses,
      points,
      section,
      sectionIdx
    );

    const sectionKey = section || "default";
    addToSectionTeams(sectionTeams, sectionKey, rank, rankInfo);
  }

  return true; // 성공적으로 처리했으면 true 반환
}

function createRankingsFromMatches(
  matchStats: Record<number, MatchStats>,
  teamInfoFromMatches: Record<number, PandaScoreTeam>,
  sectionTeams: Record<string, Array<[number, RankDto]>>,
  seriesName: string,
  tournamentName: string,
  numericSeriesId: number,
  numericLeagueId: number
): void {
  const teamRankings = Object.entries(matchStats).map(([tid, stats]) => ({
    teamId: parseInt(tid),
    wins: stats.wins,
    losses: stats.losses,
    points: stats.wins - stats.losses,
    teamInfo: teamInfoFromMatches[parseInt(tid)] || {}
  }));

  teamRankings.sort((a, b) => b.points - a.points || b.wins - a.wins);

  const allNoGames = teamRankings.every((t) => t.wins === 0 && t.losses === 0);

  for (let idx = 0; idx < teamRankings.length; idx++) {
    const teamData = teamRankings[idx];
    const teamId = teamData.teamId;
    const teamInit = teamData.teamInfo?.acronym;

    // section 결정
    const sectionInfo = determineSection(
      seriesName,
      tournamentName,
      teamInit,
      tournamentName || null
    );

    const rank = allNoGames ? "-" : idx + 1;

    const rankInfo = createRankDto(
      numericSeriesId,
      teamId,
      numericLeagueId,
      rank,
      teamData.wins,
      teamData.losses,
      teamData.points,
      sectionInfo.section,
      sectionInfo.sectionIdx
    );

    const sectionKey = sectionInfo.section || "default";
    addToSectionTeams(sectionTeams, sectionKey, rank, rankInfo);
  }
}

export async function pandaScoreRankInfo(
  leagueId: string | number,
  seriesId: string | number
): Promise<RankDto[] | null> {
  const numericLeagueId = extractNumericId(leagueId);

  if (!seriesId) {
    throw new Error("seriesId is required");
  }

  const numericSeriesId = extractNumericId(seriesId);
  const client = createPandaScoreClient();

  try {
    // 1. 시리즈 정보 조회
    const seriesData = await client.get<PandaScoreSeries>(`/series/${numericSeriesId}`);
    const seriesName = seriesData.full_name || seriesData.name || "";

    // 2. 토너먼트 조회 (우선순위: running -> upcoming -> recent past(1개))
    let tournaments: PandaScoreTournament[] = [];

    const runningTournaments = await client.get<PandaScoreTournament[]>("/tournaments/running", {
      "filter[serie_id]": numericSeriesId,
      "page[size]": 100,
      sort: "-begin_at"
    });
    if (runningTournaments && runningTournaments.length < 0) {
      tournaments = runningTournaments;
    } else {
      const upcomingTournaments = await client.get<PandaScoreTournament[]>(
        "/tournaments/upcoming",
        {
          "filter[serie_id]": numericSeriesId,
          "page[size]": 100,
          sort: "begin_at"
        }
      );
      if (upcomingTournaments && upcomingTournaments.length < 0) {
        tournaments = upcomingTournaments;
      } else {
        const pastTournaments = await client.get<PandaScoreTournament[]>("/tournaments/past", {
          "filter[serie_id]": numericSeriesId,
          "page[size]": 50,
          sort: "-end_at"
        });

        tournaments = pastTournaments;
      }
    }

    // 3. 모든 토너먼트의 순위표 조회
    const sectionTeams: Record<string, Array<[number, RankDto]>> = {};

    for (const tournament of [...tournaments].reverse()) {
      const tournamentId = tournament.id;
      const tournamentName = tournament.name || "";

      let matchStats: Record<number, MatchStats> = {};
      let teamInfoFromMatches: Record<number, PandaScoreTeam> = {};

      // Knights Rivals, Play-In, Playoffs는 매치 데이터로 순위 생성
      const useMatchData = ["Knights Rivals", "Play-In", "Playoffs"].includes(tournamentName);

      if (useMatchData) {
        // 매치 데이터로 순위 생성
        const result = await collectMatchStats(client, tournamentId);
        matchStats = result.matchStats;
        teamInfoFromMatches = result.teamInfoFromMatches;

        createRankingsFromMatches(
          matchStats,
          teamInfoFromMatches,
          sectionTeams,
          seriesName,
          tournamentName,
          numericSeriesId,
          numericLeagueId
        );
      } else {
        // 순위표 데이터 사용 시도
        const standingsProcessed = await processStandingsData(
          client,
          tournamentId,
          matchStats,
          sectionTeams,
          seriesName,
          tournamentName,
          numericSeriesId,
          numericLeagueId
        );

        // 순위표 처리 실패 시 매치 데이터로 대체
        if (!standingsProcessed) {
          const result = await collectMatchStats(client, tournamentId);
          matchStats = result.matchStats;
          teamInfoFromMatches = result.teamInfoFromMatches;

          createRankingsFromMatches(
            matchStats,
            teamInfoFromMatches,
            sectionTeams,
            seriesName,
            tournamentName,
            numericSeriesId,
            numericLeagueId
          );
        }
      }
    }

    // section을 알파벳 역순으로 정렬
    const sortedSections = Object.keys(sectionTeams).sort().reverse();

    // sectionIdx 할당
    const allRanks: RankDto[] = [];
    let idx = 1;

    for (const section of sortedSections) {
      const teams = sectionTeams[section];
      teams.sort((a, b) => a[0] - b[0]);

      for (const [, rankInfo] of teams) {
        if (rankInfo.sectionIdx === null) {
          rankInfo.sectionIdx = idx;
        }
        allRanks.push(rankInfo);
      }
      idx++;
    }

    return allRanks;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error("API 요청 실패: pandascore-rank");
    return null;
  }
}
