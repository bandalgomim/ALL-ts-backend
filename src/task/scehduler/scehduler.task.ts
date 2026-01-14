import cron, { ScheduledTask } from "node-cron";
import { infoTask } from "../info/info.task";

export type matchDataDto = {
    league_id: string,
    season_id: string,
    match_date: Date
};
type sceduleDto = {
    league_id: string,
    season_id: string,
    start: number, // ms UTC
    end: number   // ms UTC
};
const SIX_HOURS = 6 * 60 * 60 * 1000;
const scedulesMap = new Map<string, sceduleDto>(); // key = league_id
let task: ScheduledTask | null = null;
let running = false;

/* ===== scedule helpers ===== */
function buildScedules(matchData: matchDataDto[]): sceduleDto[] {
    const tmp = new Map<string, { league_id: string, season_id: string, min: number, max: number }>();

    for (const data of matchData) {
        const time = new Date(data.match_date).getTime();
        if (!Number.isFinite(time)) continue;

        const cur = tmp.get(data.league_id);
        if (!cur) {
            tmp.set(data.league_id, {
                league_id: data.league_id,
                season_id: data.season_id,
                min: time,
                max: time
            });
        } else {
            if (time < cur.min) cur.min = time;
            if (time > cur.max) cur.max = time;
        }
    }

    return Array.from(tmp.values()).map(v => ({
        league_id: v.league_id,
        season_id: v.season_id,
        start: v.min,
        end: v.max + SIX_HOURS,
    }));
}

function upsertscedule(scedule: sceduleDto) {
    const old = scedulesMap.get(scedule.league_id);
    if (!old) {
        scedulesMap.set(scedule.league_id, scedule);
        return;
    }

    // scedule는 하나, 기간만 연장
    scedulesMap.set(scedule.league_id, {
        league_id: scedule.league_id,
        season_id: scedule.season_id,
        start: Math.min(old.start, scedule.start),
        end: Math.max(old.end, scedule.end),
    });
}

/* ===== 1분 작업 ===== */
async function minuteJob() {
    if (running) return;
    running = true;
    const now = Date.now();
    try {
        for (const [ key, scedule ] of scedulesMap.entries()) {
            if (now > scedule.end) {
                scedulesMap.delete(key);
                continue;
            }

            if (now >= scedule.start && now <= scedule.end) {
                await infoTask(scedule.league_id, scedule.season_id);
            }
        }
    } finally {
        running = false;
    }
}

export function initMinuteScheduler(matchData: matchDataDto[]) {
    if (task) return; // 중복 방지

    // 🔥 seed → scedule (딱 1번)
    const scedules = buildScedules(matchData);
    for (const scedule of scedules) upsertscedule(scedule);

    task = cron.schedule("* * * * *", () => {
        minuteJob().catch(console.error);
    });

    task.start();
}
