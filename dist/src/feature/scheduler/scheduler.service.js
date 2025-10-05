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
exports.schedulerService = {
    get: (date) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, matchData_1.setPrevData)(date);
        const result = yield scheduler_dao_1.schedulerDao.get(date);
        const res = [];
        const scheduler = { league: "", start: "", end: "" };
        result.forEach((data, index) => {
            if (index === 0 || data.league_name !== result[index - 1].league_name) {
                if (index !== 0) {
                    res.push(Object.assign({}, scheduler));
                }
                scheduler.league = data.league_name;
                scheduler.start = data.match_date;
                scheduler.end = data.match_date;
                // eslint-disable-next-line @stylistic/max-len
            }
            else if (data.league_name === result[index - 1].league || (new Date(data.match_date).getTime() - new Date(result[index - 1].match_date).getTime()) > 12 * 60 * 60 * 1000) {
                res.push(Object.assign({}, scheduler));
                scheduler.start = data.match_date;
                scheduler.end = data.match_date;
            }
            else {
                scheduler.end = data.match_date;
            }
            if (index === result.length - 1) {
                res.push(Object.assign({}, scheduler));
            }
        });
        for (const item of res) {
            if (item === null || item === void 0 ? void 0 : item.end) {
                const end = new Date(item.end);
                if (!isNaN(end.getTime())) {
                    // eslint-disable-next-line @stylistic/no-mixed-operators
                    item.end = new Date(end.getTime() + 12 * 60 * 60 * 1000).toISOString();
                }
            }
        }
        return res;
    }),
    post: (data, date) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
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
        for (const league in data) {
            if (!newData[league])
                newData[league] = [];
            const prevItems = (_a = list[league]) !== null && _a !== void 0 ? _a : [];
            for (const item of data[league]) {
                if (item.homeTeamId === "TBD" || item.awayTeamId === "TBD") {
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
        const insertData = yield (0, matchData_1.matchDataTranslator)(newData);
        const supplementRes = yield (0, matchData_1.supplement)(insertData);
        if (supplementRes.status) {
            const res = yield scheduler_dao_1.schedulerDao.post(insertData);
            if (res && supplementRes.filterdMatch.length > 0) {
                yield (0, matchData_1.supplementMatchList)(supplementRes.filterdMatch);
            }
        }
        for (const leagueName of league) {
            list[leagueName] = data[leagueName];
        }
        if (date !== null) {
            yield db_redis_1.default.set(`prevMatchList_${date}`, JSON.stringify(list));
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
