"use strict";
/**
 * API Football - 시즌 정보 조회
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
exports.apiFootballSeasonInfo = apiFootballSeasonInfo;
const http_client_1 = require("../common/http-client");
const utils_1 = require("../common/utils");
const types_1 = require("../common/types");
/**
 * 리그 ID를 받아 시즌 정보를 SeasonDto 형태로 반환
 *
 * @param leagueId - 리그 ID (예: 'apifootball39' 또는 39)
 * @returns SeasonDto 형태의 시즌 정보
 */
function apiFootballSeasonInfo(leagueId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        const numericId = (0, utils_1.extractNumericId)(leagueId);
        const client = (0, http_client_1.createApiFootballClient)();
        try {
            // 1. 리그 정보 조회 (현재 시즌)
            const leagueData = yield client.get("/leagues", {
                id: numericId,
                current: "true"
            });
            if ((0, types_1.hasApiError)(leagueData) || !((_a = leagueData.response) === null || _a === void 0 ? void 0 : _a.length)) {
                return null;
            }
            const leagueInfo = leagueData.response[0];
            const league = leagueInfo.league;
            const leagueCountry = ((_b = leagueInfo.country) === null || _b === void 0 ? void 0 : _b.name) || "";
            const seasons = leagueInfo.seasons || [];
            const countryCode = (0, utils_1.getCountryCode)(leagueCountry);
            // 현재 시즌 찾기
            let currentSeason = null;
            let currentSeasonStart = null;
            let currentSeasonEnd = null;
            for (const s of seasons) {
                if (s.current) {
                    currentSeason = s.year;
                    currentSeasonStart = (_c = s.start) !== null && _c !== void 0 ? _c : null;
                    currentSeasonEnd = (_d = s.end) !== null && _d !== void 0 ? _d : null;
                    break;
                }
            }
            // current 플래그가 없으면 연도 기준 정렬하여 가장 최근 시즌 선택
            if (!currentSeason && seasons.length > 0) {
                const sortedSeasons = [...seasons].sort((a, b) => b.year - a.year);
                currentSeason = sortedSeasons[0].year;
                currentSeasonStart = (_e = sortedSeasons[0].start) !== null && _e !== void 0 ? _e : null;
                currentSeasonEnd = (_f = sortedSeasons[0].end) !== null && _f !== void 0 ? _f : null;
            }
            const result = {
                leagueId: `apifootball${numericId}`,
                leagueName: league.name,
                leagueInitial: null,
                leagueLogo: (_g = league.logo) !== null && _g !== void 0 ? _g : null,
                sportId: 3,
                countryId: countryCode,
                seasonId: `apifootball${currentSeason}`,
                seasonName: `${league.name} ${currentSeason}`,
                seasonStart: currentSeasonStart,
                seasonEnd: currentSeasonEnd
            };
            return result;
        }
        catch (error) {
            console.error("API 요청 실패:", error);
            return null;
        }
    });
}
