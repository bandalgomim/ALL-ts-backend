import redisClient from "../../../config/db.redis";
import { getTagDao } from "../../models/matchData/getTag/getTag.dao";
import { schedulerDao } from "../../models/scheduler/scheduler.dao";
import { getSchedulerResDto, postSchedulerReqDto, schedulerDto } from "../../models/scheduler/scheduler.dto";
import { setPrevData } from "../../utils/prevData";
import { parseMatchDate, parseMatchState } from "../../utils/translator";


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
            } else if (data.league_name === result[index - 1].league || (new Date(data.match_date).getTime() - new Date(result[index - 1].match_date).getTime()) > 5 * 60 * 60 * 1000) {
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
    post: async (data: postSchedulerReqDto | schedulerDto[], date: string) => {
        const prevMatchList = await redisClient.get(`prevMatchList_${date}`);
        const teamTag = await getTagDao.getTeamTag();
        const leagueTag = await getTagDao.getLeagueTag();
        if (!prevMatchList) {
            const insertData: schedulerDto[] = [];
            for (const item of data) {
                item.leagueId = leagueTag.find((tag) => tag.league_tag === item.leagueId)?.league_id || item.leagueId;
                const homeTag = item.homeTeamId;
                const awayTag = item.awayTeamId;
                let homeTeamId = homeTag;
                let awayTeamId = awayTag;

                for (const tag of teamTag) {
                    if (tag.league_id === item.leagueId) {
                        if (tag.team_tag === homeTag) homeTeamId = tag.team_id;
                        if (tag.team_tag === awayTag) awayTeamId = tag.team_id;
                        if (homeTeamId !== homeTag && awayTeamId !== awayTag) break;
                    }
                }
                item.homeTeamId = homeTeamId;
                item.awayTeamId = awayTeamId;
                item.status = parseMatchState(item.status) as string;
                item.date = parseMatchDate(item.date, item.time) as string;
                insertData.push(item);
            }
            await schedulerDao.post(insertData);
        }
    }
};
