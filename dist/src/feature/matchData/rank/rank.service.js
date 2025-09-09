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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankService = void 0;
const db_redis_1 = __importDefault(require("../../../../config/db.redis"));
const rank_dao_1 = require("../../../models/matchData/rank/rank.dao");
const matchData_1 = require("../../../utils/matchData");
exports.rankService = {
    post: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const prevRankList = yield db_redis_1.default.get("prevRankList");
        const list = JSON.parse(prevRankList);
        const leagueList = Object.keys(data);
        const newData = {};
        for (const league of leagueList) {
            if (!newData[league])
                newData[league] = [];
            for (const item of data[league]) {
                if (!newData[league].includes(item)) {
                    newData[league].push(item);
                }
            }
        }
        const insertData = yield (0, matchData_1.rankTranslator)(newData);
        yield rank_dao_1.rankDao.post(insertData);
        list[leagueList[0]] = data[leagueList[0]];
        yield db_redis_1.default.set("prevRankList", JSON.stringify(list));
    })
};
