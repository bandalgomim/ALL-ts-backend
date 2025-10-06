import redisClient from "../../config/db.redis";
import { getTagDao } from "../models/matchData/getTag/getTag.dao";
import { postRankReqDto, rankDto } from "../models/matchData/rank/rank.dto";
import { uriDto } from "../models/matchData/uri/uri.dto";
import { schedulerDao } from "../models/scheduler/scheduler.dao";
import { postSchedulerReqDto, schedulerDto } from "../models/scheduler/scheduler.dto";
import { parseMatchDate, parseMatchState } from "./translator";

export function makePrevMatchList() {
    return {
        LCK: [], KBO: [], MLB: [], "K LEAGUE1": [],
        EPL: [], BUNDESLIGA: [], LALIGA: [],
        LEAGUE1: [], "SERIE A": [], MLS: [], UCL: []
    };
}

export function makePrevUriList() {
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
        UCL: { youtube: [] }
    };
}

export function makePrevRankList() {
    return {
        LCK: [], KBO: [], MLB: [], "K LEAGUE1": [],
        EPL: [], BUNDESLIGA: [], LALIGA: [],
        LEAGUE1: [], "SERIE A": [], MLS: [], UCL: []
    };
}

export async function setPrevData(date: string) {

    const prevUriList = makePrevUriList();
    const prevMatchList = makePrevMatchList();
    const prevRankList = makePrevRankList();

    if (!await redisClient.get(`prevMatchList_${date}`)) {
        await redisClient.set(`prevUriList_${date}`, JSON.stringify(prevUriList));
        await redisClient.set(`prevMatchList_${date}`, JSON.stringify(prevMatchList));
    }

    const prevDate = getPrevDate(date, 1);
    const prev2Date = getPrevDate(date, 2);
    const nextDate = getNextDate(date, 1);

    if (!await redisClient.get(`prevMatchList_${prevDate}`)) {
        await redisClient.set(`prevUriList_${prevDate}`, JSON.stringify(prevUriList));
        await redisClient.set(`prevMatchList_${prevDate}`, JSON.stringify(prevMatchList));
    }
    if (!await redisClient.get("prevRankList")) {
        await redisClient.set("prevRankList", JSON.stringify(prevRankList));
    }
    if (!await redisClient.get(`prevMatchList_${nextDate}`)) {
        await redisClient.set(`prevUriList_${nextDate}`, JSON.stringify(prevUriList));
        await redisClient.set(`prevMatchList_${nextDate}`, JSON.stringify(prevMatchList));
    }

    await redisClient.del(`prevUriList_${prev2Date}`);
    await redisClient.del(`prevMatchList_${prev2Date}`);
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

export const getNextDate = (dateStr: string, count: number): string => {
    if (count === 0) {
        return dateStr;
    }
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return getNextDate(`${year}-${month}-${day}`, count - 1);
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

export function concatByLeague(
    prev: Record<string, schedulerDto[]> = {},
    next: Record<string, schedulerDto[]> = {}
) {
    const leagues = new Set([ ...Object.keys(prev), ...Object.keys(next) ]);
    const out: Record<string, schedulerDto[]> = {};
    for (const lg of leagues) {
        const a = prev[lg] ?? [];
        const b = next[lg] ?? [];
        out[lg] = a.concat(b);   // 순서: prev 뒤에 now 붙임
    }
    return out;
}

export async function matchDataTranslator(data: postSchedulerReqDto | postRankReqDto) {
    const insertData: schedulerDto[] = [];
    const teamTag = await getTagDao.getTeamTag();
    const leagueTag = await getTagDao.getLeagueTag();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [ league, items ] of Object.entries(data)) {
        for (const item of items) {
            const found = leagueTag.find((tag) => tag.league_tag === item.leagueId);
            item.leagueId = found?.league_id ?? item.leagueId;
            item.seasonId = found?.season_id ?? null; // 기존 로직 유지
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
            [ item.date, item.time ] = parseMatchDate(item.date, item.time) as string[];
            if (!item.date) {
                continue;
            }
            if (item.homeTeamScore === "") { item.homeTeamScore = 0; }
            if (item.awayTeamScore === "") { item.awayTeamScore = 0; }
            insertData.push(item);
        }
    }
    return insertData;
}

export async function rankTranslator(data: postRankReqDto) {
    const insertData: rankDto[] = [];
    const teamTag = await getTagDao.getTeamTag();
    const leagueTag = await getTagDao.getLeagueTag();


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [ league, items ] of Object.entries(data)) {
        for (const item of items) {
            const found = leagueTag.find((tag) => tag.league_tag === item.leagueId);
            const teamIdTag = item.teamId;
            item.leagueId = found?.league_id ?? item.leagueId;
            item.seasonId = found?.season_id ?? null; // 기존 로직 유지
            let teamId = teamIdTag;
            for (const tag of teamTag) {
                if (tag.league_id === item.leagueId) {
                    if (tag.team_tag === teamIdTag) teamId = tag.team_id;
                }
            }
            item.teamId = teamId;
            insertData.push(item);
        }
    }
    return insertData;
}

export async function supplement(data: schedulerDto[]) {
    const now = new Date();
    const date = now.toLocaleDateString("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit"
    }).replace(/\.\s?/g, "-")
        .slice(0, 7);

    const prevData = await schedulerDao.getSupplement(date);
    data.map((item) => {
        item.matchId = `${item.date.split(" ")[0]}-${item.homeTeamId}-${item.awayTeamId}-${item.doubleHeader}`;
    });
    const prevDataIds = new Set(prevData.map((item) => item.match_id));

    const filterdData = data.filter((item) => !prevDataIds.has(item.matchId));

    return { status: true, filterdMatch: filterdData };
}

export async function supplementMatchList(data: schedulerDto[]) {
    const teamIdSet = new Set(
        data.flatMap((item) => [ item.homeTeamId, item.awayTeamId ])
    );
    const matchDateSet = new Set(
        data.map((item) => item.date.split(" ")[0]) // "YYYY-MM-DD"
    );
    const dates = Array.from(matchDateSet).sort();

    // 문자열 정렬이라 YYYY-MM-DD 형식이면 올바르게 날짜순 정렬됨
    const minDate = dates[0] + "-";
    const maxDate = dates[dates.length - 1];
    const nextDate = new Date(maxDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // YYYY-MM-DD 형식으로 출력
    const maxNext = nextDate.toISOString().split("T")[0] + "-";
    await schedulerDao.getUserMatchList([ ...teamIdSet ].map((id) => Number(id)), minDate, maxNext);
}
