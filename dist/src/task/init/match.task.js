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
const external_api_1 = require("@src/external_api");
const match_service_1 = require("@src/feature/sync/match/match.service");
const matchTask = (data) => __awaiter(void 0, void 0, void 0, function* () {
    for (const item of data) {
        const { leagueId, seasonId } = item;
        let result;
        if (leagueId.startsWith("pandascore")) {
            result = yield (0, external_api_1.pandaScoreMatchInfo)(leagueId, seasonId);
        }
        else if (leagueId.startsWith("apifootball")) {
            result = yield (0, external_api_1.apiFootballMatchInfo)(leagueId, seasonId);
        }
        if (result) {
            for (const r of result) {
                console.log(r);
                const data = [r];
                yield match_service_1.matchService.patch(data);
            }
        }
        //await matchService.patch(result as patchMatchDto[]);
    }
});
exports.matchTask = matchTask;
