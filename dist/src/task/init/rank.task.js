"use strict";
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
exports.rankTask = void 0;
const external_api_1 = require("../../external_api");
const rank_service_1 = require("../../feature/sync/rank/rank.service");
const rankTask = (data) => __awaiter(void 0, void 0, void 0, function* () {
    for (const item of data) {
        const { leagueId, seasonId } = item;
        try {
            let result;
            if (leagueId.startsWith("pandascore")) {
                result = yield (0, external_api_1.pandaScoreRankInfo)(leagueId, seasonId);
            }
            else if (leagueId.startsWith("apifootball")) {
                result = yield (0, external_api_1.apiFootballRankInfo)(leagueId, seasonId);
            }
            else {
                console.warn(`⚠️ 알 수 없는 leagueId: ${leagueId}`);
                continue;
            }
            if (!result || result.length === 0) {
                console.warn(`⚠️ 랭킹 없음 또는 조회 실패: ${leagueId} / ${seasonId}`);
                continue;
            }
            yield rank_service_1.rankService.patch(result);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            console.error("❌ rankTask 실패", {
                leagueId
            });
            continue; // 다음 리그로
        }
    }
    console.log("랭킹 정보 업데이트 완료");
});
exports.rankTask = rankTask;
