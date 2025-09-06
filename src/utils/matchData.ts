import redisClient from "../../config/db.redis";
import { getTagDao } from "../models/matchData/getTag/getTag.dao";
import { postRankReqDto } from "../models/matchData/rank/rank.dto";
import { uriDto } from "../models/matchData/uri/uri.dto";
import { postSchedulerReqDto, schedulerDto } from "../models/scheduler/scheduler.dto";
import { parseMatchDate, parseMatchState } from "./translator";

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
    LCK: [],
    KBO: [],
    MLB: [],
    K리그1: [],
    EPL: [],
    BUNDESLIGA: []
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

    const prevDate = getPrevDate(date, 1);
    const prev2Date = getPrevDate(date, 2);

    if (!await redisClient.get(`prevMatchList_${prevDate}`)) {
        await redisClient.set(`prevUriList_${prevDate}`, JSON.stringify(prevUriList));
        await redisClient.set(`prevMatchList_${prevDate}`, JSON.stringify(prevMatchList));
        await redisClient.set(`prevRankList_${prevDate}`, JSON.stringify(prevRankList));
    }

    await redisClient.del(`prevUriList_${prev2Date}`);
    await redisClient.del(`prevMatchList_${prev2Date}`);
    await redisClient.del(`prevRankList_${prev2Date}`);
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

export async function matchDataTranslator(data: postSchedulerReqDto | postRankReqDto) {
    const insertData: schedulerDto[] = [];
    const teamTag = await getTagDao.getTeamTag();
    const leagueTag = await getTagDao.getLeagueTag();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [ league, items ] of Object.entries(data)) {
        for (const item of items) {
            item.leagueId = leagueTag.find((tag) =>
                tag.league_tag === item.leagueId)?.league_id || item.leagueId;
            const homeTag = item.homeTeamId;
            const awayTag = item.awayTeamId;
            let homeTeamId = homeTag;
            let awayTeamId = awayTag;

            for (const tag of teamTag) {
                if (tag.league_id === item.leagueId) {
                    if (tag.team_tag === homeTag) homeTeamId = tag.team_id;
                    if (tag.team_tag === awayTag) awayTeamId = tag.team_id;
                    if (homeTeamId !== homeTag && awayTeamId !== awayTag) break;
                }
            }
            item.homeTeamId = homeTeamId;
            item.awayTeamId = awayTeamId;
            item.status = parseMatchState(item.status) as string;
            item.date = parseMatchDate(item.date, item.time) as string;
            if (item.homeTeamScore === "") { item.homeTeamScore = 0; }
            if (item.awayTeamScore === "") { item.awayTeamScore = 0; }
            insertData.push(item);
        }
    }
    return insertData;
}
