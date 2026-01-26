"use strict";
/**
 * PandaScore - 팀 데이터 조회
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
exports.pandaScoreTeamData = pandaScoreTeamData;
const http_client_1 = require("../common/http-client");
const utils_1 = require("../common/utils");
/**
 * 리그 ID를 받아 해당 리그의 팀 정보를 TeamDto 형태로 반환
 *
 * @param leagueId - 리그 ID (예: 'pandascore293' 또는 293)
 * @returns TeamDto 형태의 팀 정보 리스트
 */
function pandaScoreTeamData(leagueId) {
    return __awaiter(this, void 0, void 0, function* () {
        const numericId = (0, utils_1.extractNumericId)(leagueId);
        const client = (0, http_client_1.createPandaScoreClient)();
        try {
            // 1. 리그 정보 조회
            const leagueData = yield client.get(`/leagues/${numericId}`, {
                "page[size]": 100
            });
            const series = leagueData.series[leagueData.series.length - 1];
            const seriesId = series.id;
            // 2. 토너먼트 조회 (running -> upcoming -> past)
            let tournaments = [];
            // 진행 중인 토너먼트
            tournaments = yield client.get("/tournaments/running", {
                "filter[serie_id]": seriesId,
                "page[size]": 100,
                sort: "-begin_at"
            });
            // 없으면 예정된 토너먼트
            if (!tournaments.length) {
                tournaments = yield client.get("/tournaments/upcoming", {
                    "filter[serie_id]": seriesId,
                    "page[size]": 100,
                    sort: "begin_at"
                });
            }
            // 그것도 없으면 종료된 토너먼트
            if (!tournaments.length) {
                tournaments = yield client.get("/tournaments/past", {
                    "filter[serie_id]": seriesId,
                    "page[size]": 100,
                    sort: "-end_at"
                });
            }
            // 3. 모든 토너먼트의 로스터에서 팀 정보 추출 (중복 제거)
            const teamDict = {};
            for (const tournament of tournaments) {
                const tournamentId = tournament.id;
                try {
                    const rostersResponse = yield client.get(`/tournaments/${tournamentId}/rosters`, { "page[size]": 100 });
                    // rosters 배열 추출
                    const rosters = Array.isArray(rostersResponse)
                        ? rostersResponse
                        : rostersResponse.rosters || [];
                    for (const roster of rosters) {
                        const teamId = roster.id;
                        if (!teamId)
                            continue;
                        const teamInfo = {
                            teamId: `pandascore${teamId}`,
                            teamName: roster.name,
                            teamInitial: roster.acronym || null,
                            teamLogo: roster.image_url || null,
                            sportId: 1,
                            countryId: roster.location || null
                        };
                        teamDict[teamId] = teamInfo;
                    }
                }
                catch (error) {
                    console.error(`⚠️ 토너먼트 ${tournamentId} 로스터 조회 실패:`, error);
                    continue;
                }
            }
            return Object.values(teamDict);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            console.error("API 요청 실패: pandascore-team-data");
            return null;
        }
    });
}
