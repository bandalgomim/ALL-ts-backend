import { schedulerDao } from "../../models/scheduler/scheduler.dao";

export const schedulerService = {
    get: async (date: string) => {
        const result = await schedulerDao.get(date);
        const res: { league: string, start: string, end: string }[] = [];
        const scheduler = {
            league: "",
            start: "",
            end: ""
        };
        result.forEach((data, index) => {
            if (index === 0 || data.league_name !== result[index - 1].league_name) {
                scheduler.league = data.league_name;
                scheduler.start = data.match_date;
                scheduler.end = data.match_date;
            // eslint-disable-next-line @stylistic/max-len
            } else if (data.league_name === result[index - 1].league || (new Date(data.match_date).getTime() - new Date(result[index - 1].match_date).getTime()) > 3 * 60 * 60 * 1000) {
                // 객체를 복사하여 추가
                res.push({ ...scheduler });
                scheduler.start = data.match_date;
                scheduler.end = data.match_date;
            } else {
                scheduler.end = data.match_date;
            }
            if (index === result.length - 1) {
                // 마지막 요소도 객체 복사하여 추가
                res.push({ ...scheduler });
            }
        });
        return res;
    }
};
