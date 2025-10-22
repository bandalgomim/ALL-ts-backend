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
exports.schedulerService = void 0;
const db_redis_1 = __importDefault(require("../../../config/db.redis"));
const scheduler_dao_1 = require("../../models/scheduler/scheduler.dao");
const matchData_1 = require("../../utils/matchData");
const fcm_1 = require("../../utils/fcm/fcm");
exports.schedulerService = {
    get: (date) => __awaiter(void 0, void 0, void 0, function* () {
        const H12 = 12 * 60 * 60 * 1000;
        const toKstIso = (date, time) => `${date}T${time}.000Z`;
        const toMsKst = (date, time) => new Date(toKstIso(date, time)).getTime();
        yield (0, matchData_1.setPrevData)(date);
        const result = yield scheduler_dao_1.schedulerDao.get(date);
        const res = [];
        let current = null;
        for (let i = 0; i < result.length; i++) {
            const row = result[i];
            const tMs = toMsKst(row.match_date, row.match_time);
            const iso = toKstIso(row.match_date, row.match_time);
            // eslint-disable-next-line @stylistic/max-len
            const needNewBlock = !current || row.league_name !== current.league || (tMs - new Date(current.end).getTime()) > H12;
            if (needNewBlock) {
                if (current)
                    res.push(current);
                current = { league: row.league_name, start: iso, end: iso };
            }
            else {
                if (current) {
                    current.end = iso; // 같은 블록이면 끝 시간만 갱신
                }
            }
        }
        if (current)
            res.push(current);
        for (const item of res) {
            const end = new Date(new Date(item.end).getTime() + H12).toISOString(); // '...Z'
            const start = new Date(item.start).toISOString();
            item.end = `${end.split("T")[0]} ${end.split("T")[1].split(".")[0]}`; // 'YYYY-MM-DD HH:MM:SS'
            item.start = `${start.split("T")[0]} ${start.split("T")[1].split(".")[0]}`; // 'YYYY-MM-DD HH:MM:SS'
        }
        return res;
    }),
    post: (data, date) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const prevMatchListRedis = yield db_redis_1.default.get(`prevMatchList_${date}`);
            let list;
            if (!prevMatchListRedis && (date === null)) {
                list = (0, matchData_1.makePrevMatchList)();
            }
            else {
                list = JSON.parse(prevMatchListRedis);
            }
            const league = Object.keys(data);
            const newData = {};
            for (const leagueName of league) {
                const incoming = data[leagueName];
                if (!Array.isArray(incoming) || incoming.length === 0) {
                    continue;
                }
            }
            for (const league in data) {
                if (!newData[league])
                    newData[league] = [];
                const prevItems = (_a = list[league]) !== null && _a !== void 0 ? _a : [];
                if (!data[league] || data[league].length === 0) {
                    continue;
                }
                else {
                    for (const item of data[league]) {
                        if (item.homeTeamId === "TBD" || item.awayTeamId === "TBD" || item.homeTeamId === "?" || item.awayTeamId === "?" || item.homeTeamId === "미정" || item.awayTeamId === "미정정") {
                            continue;
                        }
                        if (!prevItems.includes(item)) {
                            // doubleHeader 판정
                            let isDoubleHeader = false;
                            for (const exist of newData[league]) {
                                if (exist.date === item.date
                                    && exist.homeTeamId === item.homeTeamId
                                    && exist.awayTeamId === item.awayTeamId
                                    && exist.time !== item.time) {
                                    isDoubleHeader = true;
                                    break;
                                }
                            }
                            if (!isDoubleHeader) {
                                for (const exist of prevItems) {
                                    if (exist.date === item.date
                                        && exist.homeTeamId === item.homeTeamId
                                        && exist.awayTeamId === item.awayTeamId
                                        && exist.time !== item.time) {
                                        isDoubleHeader = true;
                                        break;
                                    }
                                }
                            }
                            item.doubleHeader = isDoubleHeader ? 2 : 1;
                            newData[league].push(item);
                        }
                    }
                }
            }
            const insertData = yield (0, matchData_1.matchDataTranslator)(newData);
            const supplementRes = yield (0, matchData_1.supplement)(insertData);
            if (supplementRes.status) {
                const res = yield scheduler_dao_1.schedulerDao.post(insertData);
                if (res && supplementRes.filterdMatch.length > 0) {
                    yield (0, matchData_1.supplementMatchList)(supplementRes.filterdMatch);
                }
            }
            for (const leagueName of league) {
                const live = (0, matchData_1.findLiveUpdates)(list[leagueName], data[leagueName]);
                if (live.length !== 0) {
                    for (const match of live) {
                        yield (0, fcm_1.sentNotifiLive)(match.matchId);
                    }
                }
                list[leagueName] = data[leagueName];
            }
            if (date !== null) {
                yield db_redis_1.default.set(`prevMatchList_${date}`, JSON.stringify(list));
            }
        }
        catch (error) {
            console.error("Error in schedulerService.post:", error);
            console.error("Data causing error:", JSON.stringify(data));
        }
    }),
    batch: (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(yield db_redis_1.default.get("batch_matchList"))) {
            yield db_redis_1.default.set("batch_matchList", JSON.stringify({}));
        }
        const raw = yield db_redis_1.default.get("batch_matchList");
        const prevList = JSON.parse(raw);
        const matchList = (0, matchData_1.concatByLeague)(prevList, data.matchList);
        if (data.isLast) {
            yield db_redis_1.default.del("batch_matchList");
            yield exports.schedulerService.post(matchList, null);
        }
        else {
            yield db_redis_1.default.set("batch_matchList", JSON.stringify(matchList));
        }
    })
};
