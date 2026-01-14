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
exports.teamService = void 0;
const response_status_1 = require("../../../../config/response.status");
const team_dao_1 = require("@src/models/sync/team/team.dao");
exports.teamService = {
    patch: (req) => __awaiter(void 0, void 0, void 0, function* () {
        yield team_dao_1.teamDao.patch(req);
        const res = Object.assign(Object.assign({}, response_status_1.status.SUCCESS.body), { result: null });
        return res;
    })
};
