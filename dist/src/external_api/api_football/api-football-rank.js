"use strict";
/**
 * API Football - 순위 정보 조회
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
exports.apiFootballRankInfo = apiFootballRankInfo;
const http_client_1 = require("../common/http-client");
const utils_1 = require("../common/utils");
const types_1 = require("../common/types");
/**
 * 현재 진행 중인 라운드 확인, 없으면 최근 라운드 반환
 */
function getCurrentRound(leagueId, season, client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 현재 진행 중인 라운드 우선 확인
            const currentRounds = yield client.get("/fixtures/rounds", {
                league: leagueId,
                season: season,
                current: "true"
            });
            let rounds = currentRounds.response || [];
            // 현재 라운드가 없으면 모든 라운드에서 마지막 선택
            if (!rounds.length) {
                const allRounds = yield client.get("/fixtures/rounds", {
                    league: leagueId,
                    season: season
                });
                rounds = allRounds.response || [];
            }
            return rounds.length > 0 ? rounds[0] : null;
        }
        catch (_a) {
            return null;
        }
    });
}
/**
 * 모든 그룹을 합치되, 중복되는 팀은 더 최근 경기가 있었던 그룹의 정보를 우선
 */
function mergeAllGroupsWithPriority(roundName, allStandings) {
    var _a;
    if (allStandings.length <= 1) {
        return allStandings;
    }
    const prioritizedGroups = [];
    const otherGroups = [];
    if (roundName) {
        for (const group of allStandings) {
            if (group && group.length > 0) {
                const groupName = ((_a = group[0]) === null || _a === void 0 ? void 0 : _a.group) || "";
                if (groupName) {
                    const groupLower = groupName.toLowerCase();
                    const roundLower = roundName.toLowerCase();
                    // 공통 키워드 추출
                    const groupKeywords = new Set(groupLower.replace(",", " ").split(" ")
                        .filter((word) => /^[a-z]+$/.test(word) && word.length > 2));
                    const roundKeywords = new Set(roundLower.replace("-", " ").split(" ")
                        .filter((word) => /^[a-z]+$/.test(word) && word.length > 2));
                    // 현재 라운드와 매칭되면 우선순위 그룹
                    const common = [...groupKeywords].filter((x) => roundKeywords.has(x));
                    if (common.length > 0 || roundName.includes(groupName) || groupName.includes(roundName)) {
                        prioritizedGroups.push(group);
                    }
                    else {
                        otherGroups.push(group);
                    }
                }
                else {
                    otherGroups.push(group);
                }
            }
            else {
                otherGroups.push(group);
            }
        }
    }
    else {
        otherGroups.push(...allStandings);
    }
    return [...prioritizedGroups, ...otherGroups];
}
/**
 * 리그 ID와 시즌을 받아 RankDto 형태로 순위 정보를 반환
 *
 * @param leagueId - 리그 ID (예: 'apifootball39' 또는 39)
 * @param season - 시즌 (예: 2025, 'apifootball2025' 또는 undefined - 현재 시즌 사용)
 * @returns RankDto 형태의 순위 정보 리스트
 */
function apiFootballRankInfo(leagueId, season) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const numericLeagueId = (0, utils_1.extractNumericId)(leagueId);
        const client = (0, http_client_1.createApiFootballClient)();
        try {
            // 1. 리그 정보 조회 (현재 시즌)
            const leagueData = yield client.get("/leagues", {
                id: numericLeagueId,
                current: "true"
            });
            if ((0, types_1.hasApiError)(leagueData) || !((_a = leagueData.response) === null || _a === void 0 ? void 0 : _a.length)) {
                return null;
            }
            const leagueInfo = leagueData.response[0];
            const seasons = leagueInfo.seasons || [];
            // 시즌 결정
            let currentSeason;
            if (season) {
                currentSeason = (0, utils_1.extractNumericId)(season);
            }
            else {
                // current=true 우선, 없으면 가장 최근 시즌
                const currentSeasonInfo = seasons.find((s) => s.current);
                if (currentSeasonInfo) {
                    currentSeason = currentSeasonInfo.year;
                }
                else if (seasons.length > 0) {
                    const sortedSeasons = [...seasons].sort((a, b) => b.year - a.year);
                    currentSeason = sortedSeasons[0].year;
                }
                else {
                    currentSeason = new Date().getFullYear();
                }
            }
            // 2. 순위표 조회
            const standingsData = yield client.get("/standings", {
                league: numericLeagueId,
                season: currentSeason
            });
            if ((0, types_1.hasApiError)(standingsData) || !((_b = standingsData.response) === null || _b === void 0 ? void 0 : _b.length)) {
                return [];
            }
            const leagueStandings = standingsData.response[0].league;
            const allStandings = leagueStandings.standings;
            // 3. 현재 진행 중인 라운드 확인
            const currentRound = yield getCurrentRound(numericLeagueId, currentSeason, client);
            // 4. 모든 그룹을 우선순위 정렬
            const sortedGroups = mergeAllGroupsWithPriority(currentRound, allStandings);
            // 5. 중복 제거하며 합치기
            const seenTeams = new Set();
            const standingsList = [];
            for (const group of sortedGroups) {
                for (const standing of group) {
                    const teamId = (_c = standing.team) === null || _c === void 0 ? void 0 : _c.id;
                    if (teamId && !seenTeams.has(teamId)) {
                        seenTeams.add(teamId);
                        standingsList.push(standing);
                    }
                }
            }
            const teamsData = yield client.get("/teams", {
                league: numericLeagueId,
                season: currentSeason
            });
            const teamCodeMap = {};
            if (teamsData.response) {
                for (const item of teamsData.response) {
                    teamCodeMap[item.team.id] = item.team.code;
                }
            }
            // section별로 팀을 그룹화
            const sectionTeams = {};
            for (const standing of standingsList) {
                const teamId = (_d = standing.team) === null || _d === void 0 ? void 0 : _d.id;
                const wins = standing.all.win;
                const draws = standing.all.draw;
                const losses = standing.all.lose;
                const points = standing.points;
                const rank = standing.rank;
                const section = standing.group || null;
                const rankInfo = {
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
                sectionTeams[sectionKey].push([rank || 999, rankInfo]);
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
                    rankInfo.sectionIdx = idx;
                    allRanks.push(rankInfo);
                }
                idx++;
            }
            return allRanks;
        }
        catch (error) {
            return null;
        }
    });
}
