import cron, { type ScheduledTask } from "node-cron";
import { infoTask } from "../info/info.task";

export type matchDataDto = {
  league_id: string;
  season_id: string;
  match_date: string;
};
type sceduleDto = {
  league_id: string;
  season_id: string;
  start: number; // ms UTC
  end: number; // ms UTC
};
const SIX_HOURS = 6 * 60 * 60 * 1000;
const THREE_HOURS = 3 * 60 * 60 * 1000;
const scedulesMap = new Map<string, sceduleDto>(); // key = league_id
let task: ScheduledTask | null = null;
let running = false;

/* ===== scedule helpers ===== */
function buildScedules(matchData: matchDataDto[]): sceduleDto[] {
  const tmp = new Map<string, { league_id: string; season_id: string; min: number; max: number }>();

  for (const data of matchData) {
    const time = new Date(data.match_date.replace(" ", "T") + "Z").getTime();
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

  return Array.from(tmp.values()).map((v) => ({
    league_id: v.league_id,
    season_id: v.season_id,
    start: v.min,
    end: v.league_id.startsWith("apifootball") ? v.max + THREE_HOURS : v.max + SIX_HOURS
  }));
}

function upsertscedule(scedule: sceduleDto) {
  const old = scedulesMap.get(scedule.league_id);
  if (!old || old.season_id !== scedule.season_id) {
    scedulesMap.set(scedule.league_id, scedule);
    return;
  }
  scedulesMap.set(scedule.league_id, {
    league_id: scedule.league_id,
    season_id: scedule.season_id,
    start: Math.min(old.start, scedule.start),
    end: Math.max(old.end, scedule.end)
  });
}

/* ===== 1분 작업 ===== */
async function minuteJob() {
  if (running) return;
  running = true;
  const now = Date.now();
  try {
    for (const [key, scedule] of scedulesMap.entries()) {
      if (now > scedule.end) {
        scedulesMap.delete(key);
        continue;
      }

      if (now >= scedule.start && now <= scedule.end) {
        const d = new Date(now);
        const utc =
          `${d.getUTCFullYear()}-` +
          `${String(d.getUTCMonth() + 1).padStart(2, "0")}-` +
          `${String(d.getUTCDate()).padStart(2, "0")} ` +
          `${String(d.getUTCHours()).padStart(2, "0")}:` +
          `${String(d.getUTCMinutes()).padStart(2, "0")}:` +
          `${String(d.getUTCSeconds()).padStart(2, "0")} UTC`;
        console.log("매치 및 랭킹 업데이트 작업 실행", scedule.league_id, utc);
        await infoTask(scedule.league_id, scedule.season_id);
      }
    }
  } finally {
    running = false;
  }
}

export function initMinuteScheduler(matchData: matchDataDto[]) {
  const scedules = buildScedules(matchData);
  for (const sc of scedules) upsertscedule(sc);
  if (!task) {
    task = cron.schedule("* * * * *", () => minuteJob().catch(console.error), {
      timezone: "UTC"
    });
    task.start();
  }
}
