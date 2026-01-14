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
exports.teamTask = void 0;
const external_api_1 = require("../../external_api");
const team_service_1 = require("../../feature/sync/team/team.service");
const teamTask = (data) => __awaiter(void 0, void 0, void 0, function* () {
    for (const item of data) {
        const { leagueId, seasonId } = item;
        let result;
        if (leagueId.startsWith("pandascore")) {
            result = yield (0, external_api_1.pandaScoreTeamData)(leagueId);
        }
        else if (leagueId.startsWith("apifootball")) {
            result = yield (0, external_api_1.apiFootballTeamData)(leagueId);
        }
        /*if (result) {
            for (const r of result) {
                console.log(r);
                const data = [ r ];
                await teamService.patch(data as patchTeamDto[]);
            }
        }*/
        yield team_service_1.teamService.patch(result);
    }
});
exports.teamTask = teamTask;
