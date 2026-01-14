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
exports.isSelectedService = void 0;
const isSelected_dao_1 = require("@models/isSelected/isSelected.dao");
const main_service_1 = require("@feature/main/main.service");
exports.isSelectedService = {
    patchTeam: (userId, teamId) => __awaiter(void 0, void 0, void 0, function* () {
        yield isSelected_dao_1.isSelectedDao.patchTeam(userId, teamId); // dao를 통해 업데이트
        const res = main_service_1.mainService.get(userId);
        return res;
    }),
    patchLeague: (userId, leagueId) => __awaiter(void 0, void 0, void 0, function* () {
        yield isSelected_dao_1.isSelectedDao.patchLeague(userId, leagueId); // dao를 통해 업데이트
        const res = main_service_1.mainService.get(userId);
        return res;
    }),
    patchMatch: (userId, matchId) => __awaiter(void 0, void 0, void 0, function* () {
        yield isSelected_dao_1.isSelectedDao.patchMatch(userId, matchId); // dao를 통해 업데이트
        const res = main_service_1.mainService.get(userId);
        return res;
    })
};
