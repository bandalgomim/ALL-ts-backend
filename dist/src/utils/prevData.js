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
exports.getPrevDate = exports.prevRankList = exports.prevMatchList = exports.prevUriList = void 0;
exports.setPrevData = setPrevData;
exports.mergePrevUri = mergePrevUri;
const db_redis_1 = __importDefault(require("../../config/db.redis"));
exports.prevUriList = {
    LCK: {
        soop: [],
        youtube: [],
        youtube_lck: []
    },
    KBO: {
        tving: [],
        youtube: []
    },
    K리그1: {
        coupang: [],
        youtube: []
    },
    EPL: {
        coupang: [],
        youtube: []
    },
    MLB: {
        spotv: [],
        youtube: []
    }
};
exports.prevMatchList = {
    lck: [],
    kbaseball: [],
    wbaseball: [],
    kfootball: [],
    wfootball: []
};
exports.prevRankList = {
    lck: [],
    kbo: [],
    mlb: [],
    kLeague: [],
    epl: [],
    bundesliga: []
};
function setPrevData(date) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_redis_1.default.set(`prevUriList_${date}`, JSON.stringify(exports.prevUriList));
        yield db_redis_1.default.set(`prevMatchList_${date}`, JSON.stringify(exports.prevMatchList));
        yield db_redis_1.default.set(`prevRankList_${date}`, JSON.stringify(exports.prevRankList));
        const prevDate = (0, exports.getPrevDate)(date, 2);
        yield db_redis_1.default.del(`prevUriList_${prevDate}`);
        yield db_redis_1.default.del(`prevMatchList_${prevDate}`);
        yield db_redis_1.default.del(`prevRankList_${prevDate}`);
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
