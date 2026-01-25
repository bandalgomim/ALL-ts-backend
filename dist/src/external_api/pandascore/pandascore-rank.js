"use strict";
/**
 * PandaScore - 순위 정보 조회
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pandaScoreRankInfo = pandaScoreRankInfo;
const http_client_1 = require("../common/http-client");
const utils_1 = require("../common/utils");
/**
 * 리그 ID와 시리즈 ID를 받아 RankDto 형태로 순위 정보를 반환
 *
 * @param leagueId - 리그 ID (예: 'pandascore293' 또는 293)
 * @param seriesId - 시리즈 ID (필수)
 * @returns RankDto 형태의 순위 정보 리스트
 */
function pandaScoreRankInfo(leagueId, seriesId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const numericLeagueId = (0, utils_1.extractNumericId)(leagueId);
        if (!seriesId) {
            throw new Error("seriesId is required");
        }
        const numericSeriesId = (0, utils_1.extractNumericId)(seriesId);
        const client = (0, http_client_1.createPandaScoreClient)();
        try {
            // 1. 시리즈 정보 조회
            const seriesData = yield client.get(`/series/${numericSeriesId}`);
            const seriesName = seriesData.full_name || seriesData.name || "";
            // 2. 토너먼트 조회 (우선순위: running -> upcoming -> recent past(1개))
            let tournaments = [];
            // 1) 진행 중 토너먼트 먼저 조회
            const runningTournaments = yield client.get("/tournaments/running", {
                "filter[serie_id]": numericSeriesId,
                "page[size]": 100,
                sort: "-begin_at"
            });
            if (runningTournaments && runningTournaments.length > 0) {
                tournaments = runningTournaments;
            }
            else {
                // 2) 진행 중이 없으면 예정 토너먼트 조회
                const upcomingTournaments = yield client.get("/tournaments/upcoming", {
                    "filter[serie_id]": numericSeriesId,
                    "page[size]": 100,
                    sort: "begin_at"
                });
                if (upcomingTournaments && upcomingTournaments.length > 0) {
                    tournaments = upcomingTournaments;
                }
                else {
                    // 3) 예정도 없으면 최근 종료된 토너먼트 1개만 조회
                    const pastTournaments = yield client.get("/tournaments/past", {
                        "filter[serie_id]": numericSeriesId,
                        "page[size]": 50,
                        sort: "-end_at"
                    });
                    tournaments = pastTournaments.slice(0, 1);
                }
            }
            // 3. 모든 토너먼트의 순위표 조회
            const sectionTeams = {};
            for (const tournament of [...tournaments].reverse()) {
                const tournamentId = tournament.id;
                const tournamentName = tournament.name || "";
                let standingsData = [];
                let needsMatches = false;
                try {
                    standingsData = yield client.get(`/tournaments/${tournamentId}/standings`, { "page[size]": 100 });
                    // 승패 정보가 없는지 확인 또는 standings 팀이 10개 이하면 매치 데이터 수집
                    needsMatches = standingsData.some((s) => (s.wins || 0) === 0 && (s.losses || 0) === 0) || standingsData.length <= 10;
                }
                catch (_c) {
                    needsMatches = true;
                }
                // 매치 데이터에서 승패 집계
                const matchStats = {};
                const teamInfoFromMatches = {};
                if (needsMatches || !standingsData.length) {
                    let page = 1;
                    while (true) {
                        try {
                            const matches = yield client.get(`/tournaments/${tournamentId}/matches`, { "page[size]": 100, "page[number]": page });
                            if (!matches || matches.length === 0)
                                break;
                            for (const match of matches) {
                                const winnerId = match.winner_id;
                                const opponents = match.opponents || [];
                                for (const opp of opponents) {
                                    const opponent = opp.opponent;
                                    if (!(opponent === null || opponent === void 0 ? void 0 : opponent.id))
                                        continue;
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
                                        }
                                        else {
                                            matchStats[tid].losses++;
                                        }
                                    }
                                }
                            }
                            if (matches.length < 100)
                                break;
                            page++;
                        }
                        catch (_d) {
                            break;
                        }
                    }
                }
                // 순위표가 있으면 순위표 데이터 사용
                if (standingsData.length) {
                    for (const standing of standingsData) {
                        const team = standing.team;
                        const teamId = team === null || team === void 0 ? void 0 : team.id;
                        const teamInit = team === null || team === void 0 ? void 0 : team.acronym;
                        if (!teamId)
                            continue;
                        let section = standing.group || tournamentName || null;
                        let sectionIdx = null;
                        // LCK Cup의 경우 특정 팀들을 바론/엔더 그룹으로 분리
                        if (seriesName.includes("Cup") && tournamentName === "Group Stage") {
                            if (teamInit && ["GEN", "T1", "NS", "DNS", "BRO"].includes(teamInit)) {
                                section = "GROUP BARON";
                                sectionIdx = 3;
                            }
                            else {
                                section = "GROUP ELDER";
                                sectionIdx = 2;
                            }
                        }
                        let wins = standing.wins || 0;
                        let losses = standing.losses || 0;
                        // standings에 정보가 없으면 matches 집계 사용
                        if (wins === 0 && losses === 0 && matchStats[teamId]) {
                            wins = matchStats[teamId].wins;
                            losses = matchStats[teamId].losses;
                        }
                        const points = (_a = standing.points) !== null && _a !== void 0 ? _a : wins - losses;
                        const rank = standing.rank;
                        const rankInfo = {
                            seasonId: `pandascore${numericSeriesId}`,
                            teamId: `pandascore${teamId}`,
                            leagueId: `pandascore${numericLeagueId}`,
                            rank: rank || null,
                            win: wins,
                            draw: "-",
                            lose: losses,
                            point: points,
                            section,
                            sectionIdx
                        };
                        const sectionKey = section || "default";
                        if (!sectionTeams[sectionKey]) {
                            sectionTeams[sectionKey] = [];
                        }
                        sectionTeams[sectionKey].push([rank || 999, rankInfo]);
                    }
                    // 순위표 팀이 10개 이하면 매치 데이터에서 추가 팀 검색
                    const standingsTeamCount = standingsData.length;
                    if (standingsTeamCount <= 10) {
                        const existingTeamIds = new Set(standingsData.map((s) => { var _a; return (_a = s.team) === null || _a === void 0 ? void 0 : _a.id; }).filter(Boolean));
                        for (const [tid, stats] of Object.entries(matchStats)) {
                            const teamId = parseInt(tid);
                            if (existingTeamIds.has(teamId)) {
                                continue; // 이미 standings에 있는 팀은 제외
                            }
                            const teamInfo = teamInfoFromMatches[teamId];
                            if (!teamInfo) {
                                continue;
                            }
                            // section 결정 (LCK Cup의 경우 특정 팀들을 바론/엔더 그룹으로 분리)
                            let section = tournamentName || null;
                            let sectionIdx = null;
                            if (seriesName.includes("Cup") && tournamentName === "Group Stage") {
                                const teamInit = teamInfo.acronym;
                                if (teamInit && ["GEN", "T1", "NS", "DNS", "BRO"].includes(teamInit)) {
                                    section = "GROUP BARON";
                                    sectionIdx = 3;
                                }
                                else {
                                    section = "GROUP ELDER";
                                    sectionIdx = 2;
                                }
                            }
                            const rankInfo = {
                                seasonId: `pandascore${numericSeriesId}`,
                                teamId: `pandascore${teamId}`,
                                leagueId: `pandascore${numericLeagueId}`,
                                rank: "-",
                                win: stats.wins,
                                draw: "-",
                                lose: stats.losses,
                                point: stats.wins - stats.losses,
                                section,
                                sectionIdx
                            };
                            const sectionKey = tournamentName || "default";
                            if (!sectionTeams[sectionKey]) {
                                sectionTeams[sectionKey] = [];
                            }
                            sectionTeams[sectionKey].push([999, rankInfo]);
                        }
                    }
                }
                else {
                    // 순위표가 없으면 매치 데이터로 순위 생성
                    const teamRankings = Object.entries(matchStats).map(([tid, stats]) => ({
                        teamId: parseInt(tid),
                        wins: stats.wins,
                        losses: stats.losses,
                        points: stats.wins - stats.losses,
                        teamInfo: teamInfoFromMatches[parseInt(tid)] || {}
                    }));
                    teamRankings.sort((a, b) => b.points - a.points || b.wins - a.wins);
                    const allNoGames = teamRankings.every((t) => t.wins === 0 && t.losses === 0);
                    let section = tournamentName || null;
                    for (let idx = 0; idx < teamRankings.length; idx++) {
                        const teamData = teamRankings[idx];
                        const teamId = teamData.teamId;
                        const teamInit = (_b = teamData.teamInfo) === null || _b === void 0 ? void 0 : _b.acronym;
                        // LCK Cup의 경우 특정 팀들을 바론/엔더 그룹으로 분리
                        if (seriesName.includes("Cup") && tournamentName === "Group Stage") {
                            if (teamInit && ["GEN", "T1", "NS", "DNS", "BRO"].includes(teamInit)) {
                                section = "GROUP BARON";
                            }
                            else {
                                section = "GROUP ELDER";
                            }
                        }
                        const rank = allNoGames ? "-" : idx + 1;
                        const rankInfo = {
                            seasonId: `pandascore${numericSeriesId}`,
                            teamId: `pandascore${teamId}`,
                            leagueId: `pandascore${numericLeagueId}`,
                            rank,
                            win: teamData.wins,
                            draw: "-",
                            lose: teamData.losses,
                            point: teamData.points,
                            section,
                            sectionIdx: null
                        };
                        const sectionKey = section || "default";
                        if (!sectionTeams[sectionKey]) {
                            sectionTeams[sectionKey] = [];
                        }
                        sectionTeams[sectionKey].push([typeof rank === "number" ? rank : 999, rankInfo]);
                    }
                }
            }
            // section을 알파벳 역순으로 정렬
            const sortedSections = Object.keys(sectionTeams).sort()
                .reverse();
            // sectionIdx 할당
            const allRanks = [];
            let idx = 1;
            for (const section of sortedSections) {
                const teams = sectionTeams[section];
                teams.sort((a, b) => a[0] - b[0]);
                for (const [, rankInfo] of teams) {
                    // 이미 sectionIdx가 설정되어 있으면 유지, 없으면 현재 idx 할당
                    if (rankInfo.sectionIdx === null) {
                        rankInfo.sectionIdx = idx;
                    }
                    allRanks.push(rankInfo);
                }
                idx++;
            }
            return allRanks;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            console.error("API 요청 실패: pandascore-rank");
            return null;
        }
    });
}
