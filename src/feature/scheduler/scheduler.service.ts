import redisClient from "../../../config/db.redis";
import { schedulerDao } from "../../models/scheduler/scheduler.dao";
import { getSchedulerResDto, postSchedulerReqDto } from "../../models/scheduler/scheduler.dto";
import { matchDataTranslator, prevMatchList, setPrevData } from "../../utils/matchData";

export const schedulerService = {
    get: async (date: string) => {
        await setPrevData(date);
        const result = await schedulerDao.get(date);
        const res: getSchedulerResDto = [];
        const scheduler = { league: "", start: "", end: "" };
        result.forEach((data, index) => {
            if (index === 0 || data.league_name !== result[index - 1].league_name) {
                if (index !== 0) {
                    res.push({ ...scheduler });
                }
                scheduler.league = data.league_name;
                scheduler.start = data.match_date;
                scheduler.end = data.match_date;
            // eslint-disable-next-line @stylistic/max-len
            } else if (data.league_name === result[index - 1].league || (new Date(data.match_date).getTime() - new Date(result[index - 1].match_date).getTime()) > 6 * 60 * 60 * 1000) {
                res.push({ ...scheduler });
                scheduler.start = data.match_date;
                scheduler.end = data.match_date;
            } else {
                scheduler.end = data.match_date;
            }
            if (index === result.length - 1) {
                res.push({ ...scheduler });
            }
        });
        for (const item of res) {
            if (item?.end) {
                const end = new Date(item.end);
                if (!isNaN(end.getTime())) {
                    // eslint-disable-next-line @stylistic/no-mixed-operators
                    item.end = new Date(end.getTime() + 5 * 60 * 60 * 1000).toISOString();
                }
            }
        }
        return res;
    },
    post: async (data: postSchedulerReqDto, date: string | null) => {
        const prevMatchListRedis = await redisClient.get(`prevMatchList_${date}`) as string;
        let list: postSchedulerReqDto;

        if (!prevMatchListRedis && (date === undefined)) {
            list = prevMatchList;
        } else {
            list = JSON.parse(prevMatchListRedis);
        }
        const league = Object.keys(data);
        const newData: postSchedulerReqDto = {};
        for (const league in data) {
            if (!newData[league]) newData[league] = [];
            const prevItems = list[league] ?? [];
            for (const item of data[league]) {
                if (item.homeTeamId === "TBD" || item.awayTeamId === "TBD") { continue; }
                if (!prevItems.includes(item)) {
                    // doubleHeader 판정
                    let isDoubleHeader = false;
                    for (const exist of newData[league]) {
                        if (
                            exist.date === item.date
                            && exist.homeTeamId === item.homeTeamId
                            && exist.awayTeamId === item.awayTeamId
                            && exist.time !== item.time
                        ) {
                            isDoubleHeader = true;
                            break;
                        }
                    }
                    if (!isDoubleHeader) {
                        for (const exist of prevItems) {
                            if (
                                exist.date === item.date
                                && exist.homeTeamId === item.homeTeamId
                                && exist.awayTeamId === item.awayTeamId
                                && exist.time !== item.time
                            ) {
                                isDoubleHeader = true;
                                break;
                            }
                        }
                    }
                    item.doubleHeader = isDoubleHeader ? 2 : 1;
                    newData[league].push(item);
                }
            }
        }
        const insertData = await matchDataTranslator(newData);
        await schedulerDao.post(insertData);
        list[league[0]] = data[league[0]];
        if (prevMatchListRedis) {
            await redisClient.set(`prevMatchList_${date}`, JSON.stringify(list));
        }
    }
};
