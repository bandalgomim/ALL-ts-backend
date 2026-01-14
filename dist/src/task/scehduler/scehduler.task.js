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
exports.initMinuteScheduler = initMinuteScheduler;
const node_cron_1 = __importDefault(require("node-cron"));
const info_task_1 = require("../info/info.task");
const SIX_HOURS = 6 * 60 * 60 * 1000;
const scedulesMap = new Map(); // key = league_id
let task = null;
let running = false;
/* ===== scedule helpers ===== */
function buildScedules(matchData) {
    const tmp = new Map();
    for (const data of matchData) {
        const time = new Date(data.match_date).getTime();
        if (!Number.isFinite(time))
            continue;
        const cur = tmp.get(data.league_id);
        if (!cur) {
            tmp.set(data.league_id, {
                league_id: data.league_id,
                season_id: data.season_id,
                min: time,
                max: time
            });
        }
        else {
            if (time < cur.min)
                cur.min = time;
            if (time > cur.max)
                cur.max = time;
        }
    }
    return Array.from(tmp.values()).map(v => ({
        league_id: v.league_id,
        season_id: v.season_id,
        start: v.min,
        end: v.max + SIX_HOURS,
    }));
}
function upsertscedule(scedule) {
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
function minuteJob() {
    return __awaiter(this, void 0, void 0, function* () {
        if (running)
            return;
        running = true;
        const now = Date.now();
        try {
            for (const [key, scedule] of scedulesMap.entries()) {
                if (now > scedule.end) {
                    scedulesMap.delete(key);
                    continue;
                }
                if (now >= scedule.start && now <= scedule.end) {
                    yield (0, info_task_1.infoTask)(scedule.league_id, scedule.season_id);
                }
            }
        }
        finally {
            running = false;
        }
    });
}
function initMinuteScheduler(matchData) {
    if (task)
        return; // 중복 방지
    // 🔥 seed → scedule (딱 1번)
    const scedules = buildScedules(matchData);
    for (const scedule of scedules)
        upsertscedule(scedule);
    task = node_cron_1.default.schedule("* * * * *", () => {
        minuteJob().catch(console.error);
    });
    task.start();
}
