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
exports.getCurrentRound = getCurrentRound;
exports.getTeamInfos = getTeamInfos;
const db_redis_1 = __importDefault(require("../../../config/db.redis"));
function getCurrentRound(leagueId, season, client) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const key = `init:round:${leagueId}:${season}`;
        const cached = yield db_redis_1.default.get(key);
        if (cached)
            return cached;
        try {
            // 1) current=true 먼저
            const currentRes = yield client.get("/fixtures/rounds", {
                league: leagueId,
                season,
                current: "true"
            });
            let rounds = (_a = currentRes.response) !== null && _a !== void 0 ? _a : [];
            // 2) 없으면 전체 라운드에서 "마지막" 선택(주석대로라면)
            if (!rounds.length) {
                const allRes = yield client.get("/fixtures/rounds", {
                    league: leagueId,
                    season
                });
                rounds = (_b = allRes.response) !== null && _b !== void 0 ? _b : [];
                if (rounds.length)
                    rounds = [rounds[rounds.length - 1]]; // 마지막 라운드
            }
            const round = (_c = rounds[0]) !== null && _c !== void 0 ? _c : null;
            if (round) {
                yield db_redis_1.default.set(key, round, { EX: 24 * 60 * 60 });
            }
            return round;
        }
        catch (_d) {
            return null;
        }
    });
}
function getTeamInfos(leagueId, seasonId, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = `init:teams:${leagueId}:${seasonId}`;
        const cached = yield db_redis_1.default.get(key);
        if (cached)
            return JSON.parse(cached);
        const teamsData = yield client.get("/teams", {
            league: leagueId,
            season: seasonId
        });
        if (teamsData.response) {
            yield db_redis_1.default.set(key, JSON.stringify(teamsData.response), { EX: 24 * 60 * 60 });
            return teamsData.response;
        }
        return null;
    });
}
