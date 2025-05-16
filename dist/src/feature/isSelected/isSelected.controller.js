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
exports.isSelectedController = void 0;
const isSelected_service_1 = require("./isSelected.service");
exports.isSelectedController = {
    patch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = res.locals.id;
        const teamId = parseInt(req.query.teamId);
        const matchId = parseInt(req.query.matchId);
        const leagueId = parseInt(req.query.leagueId);
        let result;
        if (teamId && !matchId && !leagueId) {
            result = yield isSelected_service_1.isSelectedService.patchTeam(userId, teamId);
        }
        else if (matchId && !teamId && !leagueId) {
            result = yield isSelected_service_1.isSelectedService.patchMatch(userId, matchId);
        }
        else if (!matchId && !teamId && leagueId) {
            result = yield isSelected_service_1.isSelectedService.patchLeague(userId, leagueId);
        }
        res.json(result);
    })
};
