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
exports.initTask = void 0;
exports.getTodayYMD = getTodayYMD;
const searchTag_service_1 = require("../../feature/searchTag/searchTag.service");
const match_service_1 = require("../../feature/sync/match/match.service");
const node_cron_1 = __importDefault(require("node-cron"));
const match_task_1 = require("./match.task");
const scehduler_task_1 = require("../scehduler/scehduler.task");
const rank_task_1 = require("./rank.task");
const team_task_1 = require("../info/team.task");
const scheduler_service_1 = require("../../feature/sync/scheduler/scheduler.service");
function getTodayYMD() {
    const today = new Date();
    return [
        today.getUTCFullYear(),
        String(today.getUTCMonth() + 1).padStart(2, "0"),
        String(today.getUTCDate()).padStart(2, "0")
    ].join("-");
}
function runDailyTasks() {
    return __awaiter(this, void 0, void 0, function* () {
        const ymd = getTodayYMD();
        const leagues = yield scheduler_service_1.schedulerService.get();
        // 리그 초기에만
        yield (0, team_task_1.teamTask)(leagues);
        yield (0, match_task_1.matchTask)(leagues);
        yield (0, rank_task_1.rankTask)(leagues);
        yield searchTag_service_1.searchTagService.patch();
        const data = yield match_service_1.matchService.get(ymd);
        console.log(`Running daily tasks for date: ${ymd}`);
        // console.log(leagues);
        (0, scehduler_task_1.initMinuteScheduler)(data);
    });
}
const initTask = () => {
    runDailyTasks();
    node_cron_1.default.schedule("0 15 * * *", // 매일 15:00
    () => {
        runDailyTasks();
    }, {
        timezone: "UTC" // 🔥 핵심
    });
};
exports.initTask = initTask;
