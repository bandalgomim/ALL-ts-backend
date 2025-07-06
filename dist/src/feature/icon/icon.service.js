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
exports.iconService = void 0;
const icon_dao_1 = require("../../models/icon/icon.dao");
const team_service_1 = require("../team/team.service");
const league_service_1 = require("../league/league.service");
exports.iconService = {
    patchIcon: (userId, type, id, icon) => __awaiter(void 0, void 0, void 0, function* () {
        yield icon_dao_1.iconDao.patchIcon(userId, type, id, icon); // dao를 통해 업데이트
        let res;
        if (type === "team") {
            res = yield team_service_1.teamService.get(userId, id); // 팀 아이콘 업데이트 후 팀 정보 가져오기
        }
        else if (type === "league") {
            res = yield league_service_1.leagueService.get(userId, id); // 리그 아이콘 업데이트 후 리그 정보 가져오기
        }
        else {
            throw new Error("Invalid type provided for icon update");
        }
        return res;
    })
};
