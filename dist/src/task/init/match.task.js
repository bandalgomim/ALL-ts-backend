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
exports.matchTask = void 0;
const external_api_1 = require("../../external_api");
const match_service_1 = require("../../feature/sync/match/match.service");
const matchTask = (data) => __awaiter(void 0, void 0, void 0, function* () {
    for (const item of data) {
        const { leagueId, seasonId } = item;
        try {
            let result = null;
            if (leagueId.startsWith("pandascore")) {
                result = yield (0, external_api_1.pandaScoreMatchInfo)(leagueId, seasonId);
            }
            else if (leagueId.startsWith("apifootball")) {
                result = yield (0, external_api_1.apiFootballMatchInfo)(leagueId, seasonId);
            }
            if (!result || result.length === 0) {
                console.warn(`⚠️ 매치 없음 또는 조회 실패: ${leagueId} / ${seasonId}`);
                continue;
            }
            const ok = yield match_service_1.matchService.patch(result);
            if (ok) {
                yield match_service_1.matchService.patchMatchList(result);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            console.error("❌ matchTask 실패", {
                leagueId
            });
            continue; // 다음 리그로
        }
    }
    console.log("매치 정보 업데이트 완료");
});
exports.matchTask = matchTask;
