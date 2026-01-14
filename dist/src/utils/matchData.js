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
exports.getNextDate = exports.getPrevDate = void 0;
exports.makePrevMatchList = makePrevMatchList;
exports.makePrevUriList = makePrevUriList;
exports.makePrevRankList = makePrevRankList;
exports.setPrevData = setPrevData;
exports.mergePrevUri = mergePrevUri;
exports.concatByLeague = concatByLeague;
exports.supplement = supplement;
exports.supplementMatchList = supplementMatchList;
exports.findLiveUpdates = findLiveUpdates;
const db_redis_1 = __importDefault(require("../../config/db.redis"));
const scheduler_dao_1 = require("@models/scheduler/scheduler.dao");
function makePrevMatchList() {
    return {
        LCK: [], KBO: [], MLB: [], "K LEAGUE1": [],
        EPL: [], BUNDESLIGA: [], LALIGA: [],
        LEAGUE1: [], "SERIE A": [], MLS: [], UCL: [], WORLDS: []
    };
}
function makePrevUriList() {
    return {
        LCK: { soop: [], youtube: [], youtube_lck: [] },
        KBO: { tving: [], youtube: [] },
        "K LEAGUE1": { coupang: [], youtube: [] },
        EPL: { coupang: [], youtube: [] },
        BUNDESLIGA: { youtube: [] },
        MLB: { spotv: [], youtube: [] },
        LALIGA: { youtube: [] },
        LEAGUE1: { youtube: [] },
        "SERIE A": { youtube: [] },
        MLS: { youtube: [] },
        UCL: { youtube: [] },
        WORLDS: { soop: [], youtube: [] }
    };
}
function makePrevRankList() {
    return {
        LCK: [], KBO: [], MLB: [], "K LEAGUE1": [],
        EPL: [], BUNDESLIGA: [], LALIGA: [],
        LEAGUE1: [], "SERIE A": [], MLS: [], UCL: [], WORLDS: []
    };
}
function setPrevData(date) {
    return __awaiter(this, void 0, void 0, function* () {
        const prevUriList = makePrevUriList();
        const prevMatchList = makePrevMatchList();
        const prevRankList = makePrevRankList();
        if (!(yield db_redis_1.default.get(`prevMatchList_${date}`))) {
            yield db_redis_1.default.set(`prevUriList_${date}`, JSON.stringify(prevUriList));
            yield db_redis_1.default.set(`prevMatchList_${date}`, JSON.stringify(prevMatchList));
        }
        const prevDate = (0, exports.getPrevDate)(date, 1);
        const prev2Date = (0, exports.getPrevDate)(date, 2);
        const nextDate = (0, exports.getNextDate)(date, 1);
        if (!(yield db_redis_1.default.get(`prevMatchList_${prevDate}`))) {
            yield db_redis_1.default.set(`prevUriList_${prevDate}`, JSON.stringify(prevUriList));
            yield db_redis_1.default.set(`prevMatchList_${prevDate}`, JSON.stringify(prevMatchList));
        }
        if (!(yield db_redis_1.default.get("prevRankList"))) {
            yield db_redis_1.default.set("prevRankList", JSON.stringify(prevRankList));
        }
        if (!(yield db_redis_1.default.get(`prevMatchList_${nextDate}`))) {
            yield db_redis_1.default.set(`prevUriList_${nextDate}`, JSON.stringify(prevUriList));
            yield db_redis_1.default.set(`prevMatchList_${nextDate}`, JSON.stringify(prevMatchList));
        }
        yield db_redis_1.default.del(`prevUriList_${prev2Date}`);
        yield db_redis_1.default.del(`prevMatchList_${prev2Date}`);
    });
}
const getPrevDate = (dateStr, count) => {
    if (count === 0) {
        return dateStr;
    }
    const date = new Date(dateStr);
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return (0, exports.getPrevDate)(`${year}-${month}-${day}`, count - 1);
};
exports.getPrevDate = getPrevDate;
const getNextDate = (dateStr, count) => {
    if (count === 0) {
        return dateStr;
    }
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return (0, exports.getNextDate)(`${year}-${month}-${day}`, count - 1);
};
exports.getNextDate = getNextDate;
// 안전 파서
const safeJsonParse = (raw, fallback) => {
    try {
        if (raw == null)
            return fallback;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : fallback;
    }
    catch (_a) {
        return fallback;
    }
};
function mergePrevUri(date) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const rawToday = yield db_redis_1.default.get(`prevUriList_${date}`);
        const rawPrev = yield db_redis_1.default.get(`prevUriList_${(0, exports.getPrevDate)(date, 1)}`);
        const obj1 = safeJsonParse(rawToday, {});
        const obj2 = safeJsonParse(rawPrev, {});
        const merged = {};
        const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
        for (const key of keys) {
            const v1 = (_a = obj1[key]) !== null && _a !== void 0 ? _a : {};
            const v2 = (_b = obj2[key]) !== null && _b !== void 0 ? _b : {};
            merged[key] = {};
            const subKeys = new Set([...Object.keys(v1), ...Object.keys(v2)]);
            for (const subKey of subKeys) {
                const arr1 = Array.isArray(v1[subKey]) ? v1[subKey] : [];
                const arr2 = Array.isArray(v2[subKey]) ? v2[subKey] : [];
                merged[key][subKey] = Array.from(new Set([...arr1, ...arr2]));
            }
        }
        return merged;
    });
}
function concatByLeague(prev = {}, next = {}) {
    var _a, _b;
    const leagues = new Set([...Object.keys(prev), ...Object.keys(next)]);
    const out = {};
    for (const lg of leagues) {
        const a = (_a = prev[lg]) !== null && _a !== void 0 ? _a : [];
        const b = (_b = next[lg]) !== null && _b !== void 0 ? _b : [];
        out[lg] = a.concat(b); // 순서: prev 뒤에 now 붙임
    }
    return out;
}
function supplement(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const date = now.toLocaleDateString("ko-KR", {
            timeZone: "Asia/Seoul",
            year: "numeric",
            month: "2-digit"
        }).replace(/\.\s?/g, "-")
            .slice(0, 7);
        const prevData = yield scheduler_dao_1.schedulerDao.getSupplement(date);
        data.map((item) => {
            item.matchId = `${item.date.split(" ")[0]}-${item.homeTeamId}-${item.awayTeamId}-${item.doubleHeader}`;
        });
        const prevDataIds = new Set(prevData.map((item) => item.match_id));
        const filterdData = data.filter((item) => !prevDataIds.has(item.matchId));
        return { status: true, filterdMatch: filterdData };
    });
}
function supplementMatchList(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const teamIdSet = new Set(data.flatMap((item) => [item.homeTeamId, item.awayTeamId]));
        const matchDateSet = new Set(data.map((item) => item.date.split(" ")[0]) // "YYYY-MM-DD"
        );
        const dates = Array.from(matchDateSet).sort();
        // 문자열 정렬이라 YYYY-MM-DD 형식이면 올바르게 날짜순 정렬됨
        const minDate = dates[0] + "-";
        const maxDate = dates[dates.length - 1];
        const nextDate = new Date(maxDate);
        nextDate.setDate(nextDate.getDate() + 1);
        // YYYY-MM-DD 형식으로 출력
        const maxNext = nextDate.toISOString().split("T")[0] + "-";
        yield scheduler_dao_1.schedulerDao.getUserMatchList([...teamIdSet].map((id) => Number(id)), minDate, maxNext);
    });
}
function findLiveUpdates(list, data) {
    const oldMap = new Map(list.map((m) => [m.matchId, m]));
    const liveUpdates = [];
    for (const match of data) {
        if (match.status !== "live")
            continue; // live만 관심 있음
        const prev = oldMap.get(match.matchId);
        // 1️⃣ next → live 로 바뀐 경우
        if (prev && prev.status === "next") {
            liveUpdates.push(match);
            // eslint-disable-next-line @stylistic/brace-style
        }
        // 2️⃣ 기존엔 없고 새로 생긴 live
        else if (!prev) {
            liveUpdates.push(match);
        }
    }
    return liveUpdates;
}
