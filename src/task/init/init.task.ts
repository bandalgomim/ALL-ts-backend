import { searchTagService } from "@feature/searchTag/searchTag.service";
import cron from "node-cron";

export const initTask = () => {
    searchTagService.patch();
    cron.schedule("0 0 * * *", () => {
        searchTagService.patch();
    });
};
