"use strict";
/**
 * PandaScore - 시즌 정보 조회
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
exports.pandaScoreSeasonInfo = pandaScoreSeasonInfo;
const http_client_1 = require("../common/http-client");
const utils_1 = require("../common/utils");
const dto_1 = require("./dto");
/**
 * 리그 ID를 받아 시즌 정보를 SeasonDto 형태로 반환
 *
 * @param leagueId - 리그 ID (예: 'pandascore293' 또는 293)
 * @returns SeasonDto 형태의 시즌 정보
 */
function pandaScoreSeasonInfo(leagueId) {
    return __awaiter(this, void 0, void 0, function* () {
        const numericId = (0, utils_1.extractNumericId)(leagueId);
        const client = (0, http_client_1.createPandaScoreClient)();
        try {
            // 1. 리그 정보 조회
            const leagueData = yield client.get(`/leagues/${numericId}`, {
                "page[size]": 100
            });
            const leagueName = leagueData.name || "Unknown League";
            const slug = (leagueData.slug || "").toLowerCase();
            // slug에서 국가 코드 추출
            let countryId = null;
            for (const [key, code] of Object.entries(dto_1.PANDASCORE_COUNTRY_MAP)) {
                if (slug.includes(key)) {
                    countryId = code;
                    break;
                }
            }
            // 가장 최근 시리즈
            const series = leagueData.series[leagueData.series.length - 1];
            const result = {
                leagueId: `pandascore${numericId}`,
                leagueName,
                leagueInitial: leagueName,
                leagueLogo: leagueData.image_url || null,
                sportId: 1,
                countryId,
                seasonId: `pandascore${series.id}`,
                seasonName: `${leagueName} ${series.full_name}`,
                seasonStart: series.begin_at || null,
                seasonEnd: series.end_at || null
            };
            return result;
        }
        catch (error) {
            console.error("API 요청 실패:", error);
            return null;
        }
    });
}
