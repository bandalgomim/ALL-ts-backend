import { searchTagService } from "@feature/searchTag/searchTag.service";
import { matchService } from "@src/feature/sync/match/match.service";
import cron from "node-cron";
import { matchTask, taskDto } from "./match.task";
import { initMinuteScheduler, matchDataDto } from "../scehduler/scehduler.task";
import { rankTask } from "./rank.task";
import { teamTask } from "../info/team.task";
import { schedulerService } from "@src/feature/sync/scheduler/scheduler.service";
export function getTodayYMD(): string {
    const today = new Date();
    return [
        today.getUTCFullYear(),
        String(today.getUTCMonth() + 1).padStart(2, "0"),
        String(today.getUTCDate()).padStart(2, "0")
    ].join("-");
}

async function runDailyTasks() {
    const ymd = getTodayYMD();

    const leagues = await schedulerService.get();

    // 리그 초기에만
    await teamTask(leagues as taskDto[]);
    await matchTask(leagues as taskDto[]);
    await rankTask(leagues as taskDto[]);
    await searchTagService.patch();
    const data = await matchService.get(ymd);
    console.log(`Running daily tasks for date: ${ymd}`);

    // console.log(leagues);
    initMinuteScheduler(data as matchDataDto[]);

}

export const initTask = () => {
    runDailyTasks();

    cron.schedule(
        "10 0 * * *",
        () => {
            runDailyTasks();
        },
        {
            timezone: "UTC" // 🔥 핵심
        }
    );
};


