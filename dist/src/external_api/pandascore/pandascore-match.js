"use strict";
/**
 * PandaScore - 경기 정보 조회
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
exports.pandaScoreMatchInfo = pandaScoreMatchInfo;
const http_client_1 = require("../common/http-client");
const utils_1 = require("../common/utils");
/**
 * PandaScore 상태를 MatchStatus로 변환
 */
function convertPandaScoreStatus(status) {
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
function pandaScoreMatchInfo(leagueId, seriesId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const numericLeagueId = (0, utils_1.extractNumericId)(leagueId);
        if (!seriesId) {
            throw new Error("seriesId is required");
        }
        const numericSeriesId = (0, utils_1.extractNumericId)(seriesId);
        const client = (0, http_client_1.createPandaScoreClient)();
        try {
            // 1. 시리즈 정보 직접 조회
            // 2. 해당 시리즈의 모든 토너먼트 조회
            const allTournaments = [];
            // 진행 중인 토너먼트
            const runningTournaments = yield client.get("/tournaments/running", {
                "filter[serie_id]": numericSeriesId,
                "page[size]": 100,
                sort: "-begin_at"
            });
            allTournaments.push(...runningTournaments);
            // 예정된 토너먼트
            const upcomingTournaments = yield client.get("/tournaments/upcoming", {
                "filter[serie_id]": numericSeriesId,
                "page[size]": 100,
                sort: "begin_at"
            });
            allTournaments.push(...upcomingTournaments);
            // 종료된 토너먼트
            const pastTournaments = yield client.get("/tournaments/past", {
                "filter[serie_id]": numericSeriesId,
                "page[size]": 100,
                sort: "-end_at"
            });
            allTournaments.push(...pastTournaments);
            // 3. 모든 토너먼트의 경기 정보 수집
            const allMatches = [];
            for (const tournament of allTournaments) {
                const tournamentId = tournament.id;
                try {
                    let page = 1;
                    const tournamentMatches = [];
                    while (true) {
                        const matches = yield client.get(`/tournaments/${tournamentId}/matches`, { "page[size]": 100, page });
                        if (!matches || matches.length === 0)
                            break;
                        for (const match of matches) {
                            const dateTime = (0, utils_1.formatDateTime)(match.scheduled_at || "");
                            // 상대팀 정보 추출
                            const opponents = match.opponents || [];
                            const homeTeamId = ((_b = (_a = opponents[0]) === null || _a === void 0 ? void 0 : _a.opponent) === null || _b === void 0 ? void 0 : _b.id)
                                ? `pandascore${opponents[0].opponent.id}`
                                : "";
                            const awayTeamId = ((_d = (_c = opponents[1]) === null || _c === void 0 ? void 0 : _c.opponent) === null || _d === void 0 ? void 0 : _d.id)
                                ? `pandascore${opponents[1].opponent.id}`
                                : "";
                            // 스코어 추출
                            const results = match.results || [];
                            const homeTeamScore = ((_e = results[0]) === null || _e === void 0 ? void 0 : _e.score) || 0;
                            const awayTeamScore = ((_f = results[1]) === null || _f === void 0 ? void 0 : _f.score) || 0;
                            const status = convertPandaScoreStatus(match.status);
                            const matchInfo = {
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
                        if (matches.length < 100)
                            break;
                        page++;
                    }
                    allMatches.push(...tournamentMatches);
                }
                catch (error) {
                    console.error(`❌ 토너먼트 ${tournamentId} 경기 조회 실패:`, error);
                    continue;
                }
            }
            return allMatches;
        }
        catch (error) {
            console.error("API 요청 실패:", error);
            return null;
        }
    });
}
