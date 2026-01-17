"use strict";
/**
 * API Football - 경기 정보 조회
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
exports.apiFootballMatchInfo = apiFootballMatchInfo;
const http_client_1 = require("../common/http-client");
const utils_1 = require("../common/utils");
const types_1 = require("../common/types");
/**
 * API Football 상태를 MatchStatus로 변환
 */
function convertApiFootballStatus(apiStatus) {
    if (["FT", "AET", "PEN"].includes(apiStatus)) {
        return "end";
    }
    else if (["LIVE", "1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT"].includes(apiStatus)) {
        return "live";
    }
    else if (["NS", "TBD"].includes(apiStatus)) {
        return "next";
    }
    else {
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
function apiFootballMatchInfo(leagueId, season) {
    return __awaiter(this, void 0, void 0, function* () {
        const numericLeagueId = (0, utils_1.extractNumericId)(leagueId);
        if (!season) {
            throw new Error("season is required");
        }
        const numericSeason = (0, utils_1.extractNumericId)(season);
        const originalSeason = typeof season === "string"
            ? season
            : `apifootball${season}`;
        const client = (0, http_client_1.createApiFootballClient)();
        try {
            // 2. 해당 시즌의 모든 경기 조회
            const fixturesData = yield client.get("/fixtures", {
                league: numericLeagueId,
                season: numericSeason
            });
            if ((0, types_1.hasApiError)(fixturesData) || !fixturesData.response) {
                console.log("⚠️ 경기 조회 실패");
                return null;
            }
            const fixtures = fixturesData.response;
            const allMatches = [];
            // 경기 정보를 MatchDto 형태로 가공
            for (const fixtureData of fixtures) {
                const fixture = fixtureData.fixture;
                const teams = fixtureData.teams;
                const goals = fixtureData.goals;
                const dateTime = (0, utils_1.formatDateTime)(fixture.date);
                const homeTeamId = teams.home.id ? `apifootball${teams.home.id}` : "";
                const awayTeamId = teams.away.id ? `apifootball${teams.away.id}` : "";
                const status = convertApiFootballStatus(fixture.status.short);
                const matchInfo = {
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
        }
        catch (error) {
            console.error("API 요청 실패:", error);
            return null;
        }
    });
}
