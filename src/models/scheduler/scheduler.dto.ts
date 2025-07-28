type SchedulerType = "kLeague1" | "bundesliga" | "lck" | "kbo" | "epl" | "mlb";

export type getSchedulerResDto = {
    [key in SchedulerType]?: string[]
};

