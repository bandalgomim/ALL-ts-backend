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
exports.infoTask = void 0;
const external_api_1 = require("../../external_api");
const init_task_1 = require("../init/init.task");
const match_service_1 = require("../../feature/sync/match/match.service");
const rank_service_1 = require("../../feature/sync/rank/rank.service");
const db_redis_1 = __importDefault(require("../../../config/db.redis"));
const sentNotification_controller_1 = require("../../feature/fcm/sentNotification.controller");
const infoTask = (leagueId, seasonId) => __awaiter(void 0, void 0, void 0, function* () {
    const today = (0, init_task_1.getTodayYMD)();
    let rank;
    let match;
    if (leagueId.startsWith("pandascore")) {
        rank = yield (0, external_api_1.pandaScoreRankInfo)(leagueId, seasonId);
        match = yield (0, external_api_1.pandaScoreMatchToday)(leagueId, seasonId, today);
    }
    else if (leagueId.startsWith("apifootball")) {
        rank = yield (0, external_api_1.apiFootballRankInfo)(leagueId, seasonId);
        match = yield (0, external_api_1.apiFootballMatchToday)(leagueId, seasonId, today);
    }
    if (match) {
        for (const m of match) {
            if (m.status === "live") {
                const key = `push:live:${m.matchId}`;
                const ok = yield db_redis_1.default.set(key, "1", {
                    NX: true,
                    EX: 72 * 60 * 60
                });
                if (ok === "OK") {
                    yield (0, sentNotification_controller_1.sentNotificationLive)(m.matchId);
                }
            }
        }
    }
    yield match_service_1.matchService.patch(match);
    yield rank_service_1.rankService.patch(rank);
});
exports.infoTask = infoTask;
