import { schedulerDao } from "@src/models/sync/scheduler/scheduler.dao";

export const schedulerService = {
  get: async () => {
    const result = await schedulerDao.get();
    return result;
  }
};
