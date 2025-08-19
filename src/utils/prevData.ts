import redisClient from "../../config/db.redis";
import { uriDto } from "../models/matchData/uri/uri.dto";

export const prevUriList = {
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

export const prevMatchList = {
    lck: [],
    kbaseball: [],
    wbaseball: [],
    kfootball: [],
    wfootball: []
};

export const prevRankList = {
    lck: [],
    kbo: [],
    mlb: [],
    kLeague: [],
    epl: [],
    bundesliga: []
};

export async function setPrevData(date: string) {
    await redisClient.set(`prevUriList_${date}`, JSON.stringify(prevUriList));
    await redisClient.set(`prevMatchList_${date}`, JSON.stringify(prevMatchList));
    await redisClient.set(`prevRankList_${date}`, JSON.stringify(prevRankList));

    const prevDate = getPrevDate(date, 2);

    await redisClient.del(`prevUriList_${prevDate}`);
    await redisClient.del(`prevMatchList_${prevDate}`);
    await redisClient.del(`prevRankList_${prevDate}`);
}

export const getPrevDate = (dateStr: string, count: number): string => {
    if (count === 0) {
        return dateStr;
    }
    const date = new Date(dateStr);
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return getPrevDate(`${year}-${month}-${day}`, count - 1);
};

// 안전 파서
const safeJsonParse = <T>(raw: string | null | undefined, fallback: T): T => {
    try {
        if (raw == null) return fallback;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? (parsed as T) : fallback;
    } catch {
        return fallback;
    }
};

export async function mergePrevUri(date: string) {
    const rawToday = await redisClient.get(`prevUriList_${date}`);
    const rawPrev  = await redisClient.get(`prevUriList_${getPrevDate(date, 1)}`);

    const obj1 = safeJsonParse<Record<string, Record<string, string[]>>>(rawToday, {});
    const obj2 = safeJsonParse<Record<string, Record<string, string[]>>>(rawPrev, {});

    const merged: uriDto = {} as Record<string, Record<string, string[]>>;

    const keys = new Set([ ...Object.keys(obj1), ...Object.keys(obj2) ]);
    for (const key of keys) {
        const v1 = obj1[key] ?? {};
        const v2 = obj2[key] ?? {};
        merged[key] = {};
        const subKeys = new Set([ ...Object.keys(v1), ...Object.keys(v2) ]);
        for (const subKey of subKeys) {
            const arr1 = Array.isArray(v1[subKey]) ? v1[subKey] : [];
            const arr2 = Array.isArray(v2[subKey]) ? v2[subKey] : [];
            merged[key][subKey] = Array.from(new Set([ ...arr1, ...arr2 ]));
        }
    }
    return merged;
}
