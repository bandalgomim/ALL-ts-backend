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
        youtube: []
    },
    EPL: {
        spotv: [],
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

export async function mergePrevUri(date: string) {
    const obj1 = JSON.parse(await redisClient.get(`prevUriList_${date}`) as string);
    const obj2 = JSON.parse(await redisClient.get(`prevUriList_${getPrevDate(date, 1)}`) as string);

    const merged: uriDto = {};
    const keys = new Set([ ...Object.keys(obj1), ...Object.keys(obj2) ]);
    for (const key of keys) {
        merged[key] = {};
        const subKeys = new Set([
            ...Object.keys(obj1[key] || {}),
            ...Object.keys(obj2[key] || {})
        ]);
        for (const subKey of subKeys) {
            const arr1 = (obj1[key]?.[subKey] ?? []);
            const arr2 = (obj2[key]?.[subKey] ?? []);

            // 중복 제거 후 합치기
            merged[key][subKey] = Array.from(new Set([ ...arr1, ...arr2 ]));
        }
    }
    return merged;
}
