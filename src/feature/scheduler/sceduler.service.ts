import { schedulerDao } from "@src/models/scheduler/scheduler.dao";

export const schedulerService = {
    get: async () => {
        const result = await schedulerDao.get();
        return result;
    }
};
