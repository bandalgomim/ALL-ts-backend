import { searchTagService } from "@feature/searchTag/searchTag.service";
import { schedulerService } from "@src/feature/scheduler/sceduler.service";
import { matchService } from "@src/feature/sync/match/match.service";
import cron from "node-cron";
import { matchTask, taskDto } from "./match.task";
import { initMinuteScheduler, matchDataDto } from "../scehduler/scehduler.task";
import { rankTask } from "./rank.task";
import { teamTask } from "../info/team.task";

export function getTodayYMD(): string {
    const today = new Date();
    return [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");
}

async function runDailyTasks() {
    const ymd = getTodayYMD();
    const leagues = await schedulerService.get();
    await teamTask(leagues as taskDto[]);
    await matchTask(leagues as taskDto[]);
    await rankTask(leagues as taskDto[]);
    await searchTagService.patch();
    const data = await matchService.get(ymd);
    initMinuteScheduler(data as matchDataDto[]);

}

export const initTask = () => {
    runDailyTasks();
    cron.schedule(
        "0 0 * * *", () => { runDailyTasks(); }
    );
};

