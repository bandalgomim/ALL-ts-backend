"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Football - 팀 데이터 조회 (standings 제거 버전)
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
exports.apiFootballTeamData = apiFootballTeamData;
const http_client_1 = require("../common/http-client");
const utils_1 = require("../common/utils");
const types_1 = require("../common/types");
/**
 * 리그 ID를 받아 해당 리그의 팀 정보를 TeamDto 형태로 반환 (Teams API 기반)
 *
 * @param leagueId - 리그 ID (예: 'apifootball39' 또는 39)
 * @returns TeamDto 형태의 팀 정보 리스트
 */
function apiFootballTeamData(leagueId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        const numericId = (0, utils_1.extractNumericId)(leagueId);
        const client = (0, http_client_1.createApiFootballClient)();
        try {
            // 1) 리그 정보 조회 (현재 시즌/리그 국가코드 fallback 확보)
            const leagueData = yield client.get("/leagues", {
                id: numericId,
                current: "true"
            });
            if ((0, types_1.hasApiError)(leagueData) || !((_a = leagueData.response) === null || _a === void 0 ? void 0 : _a.length)) {
                console.log("❌ 리그 정보 조회 실패");
                return [];
            }
            const leagueInfo = leagueData.response[0];
            const seasons = leagueInfo.seasons || [];
            // 현재 시즌 찾기
            let currentSeason = 2025;
            for (const s of seasons) {
                if (s.current) {
                    currentSeason = s.year;
                    break;
                }
            }
            // 리그 국가 코드(팀 country가 World/비어있을 때 fallback)
            // (dto 구조에 따라 country.code 또는 country.flag가 있을 수 있음)
            const leagueCountryCode = ((_d = (_c = (_b = leagueInfo === null || leagueInfo === void 0 ? void 0 : leagueInfo.country) === null || _b === void 0 ? void 0 : _b.code) === null || _c === void 0 ? void 0 : _c.toUpperCase) === null || _d === void 0 ? void 0 : _d.call(_c))
                || (((_e = leagueInfo === null || leagueInfo === void 0 ? void 0 : leagueInfo.country) === null || _e === void 0 ? void 0 : _e.flag)
                    ? (_f = String(leagueInfo.country.flag)
                        .split("/")
                        .pop()) === null || _f === void 0 ? void 0 : _f.replace(".svg", "").toUpperCase()
                    : "")
                || "";
            // 2) Teams API로 팀 목록 조회 (standings 제거)
            const teamsData = yield client.get("/teams", {
                league: numericId,
                season: currentSeason
            });
            if ((0, types_1.hasApiError)(teamsData) || !((_g = teamsData.response) === null || _g === void 0 ? void 0 : _g.length)) {
                console.log("⚠️ 팀 목록 조회 실패");
                return [];
            }
            // 3) TeamDto 생성 (중복 제거)
            const teamDict = {};
            for (const item of teamsData.response) {
                const team = item.team;
                const teamId = team === null || team === void 0 ? void 0 : team.id;
                if (!teamId)
                    continue;
                const teamCountry = team.country || "";
                const countryId = teamCountry && teamCountry !== "World"
                    ? (0, utils_1.getCountryCode)(teamCountry)
                    : leagueCountryCode;
                teamDict[teamId] = {
                    teamId: `apifootball${teamId}`,
                    teamName: team.name,
                    teamInitial: team.code || null,
                    teamLogo: team.logo || null,
                    sportId: 3,
                    countryId: countryId || ""
                };
            }
            return Object.values(teamDict);
        }
        catch (error) {
            console.error("API 요청 실패:", error);
            return null;
        }
    });
}
