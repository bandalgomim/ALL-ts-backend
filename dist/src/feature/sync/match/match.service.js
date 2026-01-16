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
exports.matchService = void 0;
const match_dao_1 = require("../../../models/sync/match/match.dao");
exports.matchService = {
    get: (date) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield match_dao_1.matchDao.get(date);
        return data;
    }),
    patch: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield match_dao_1.matchDao.patch(data);
        return result;
    }),
    patchMatchList: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield match_dao_1.matchDao.patchMatchList(data);
        return result;
    })
};
