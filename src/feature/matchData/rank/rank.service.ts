import redisClient from "../../../../config/db.redis";
import { rankDao } from "@models/matchData/rank/rank.dao";
import { postRankReqDto } from "@models/matchData/rank/rank.dto";
import { rankTranslator } from "@src/utils/matchData";

export const rankService = {
    post: async (data: postRankReqDto) => {
        const prevRankList = await redisClient.get("prevRankList") as string;
        const list = JSON.parse(prevRankList) as postRankReqDto;
        const leagueList = Object.keys(data);
        const newData: postRankReqDto = {};

        for (const league of leagueList) {
            if (!newData[league]) newData[league] = [];
            if (!data[league] || data[league].length === 0) {
                continue;
            } else {
                for (const item of data[league]) {
                    if (!newData[league].includes(item)) {
                        newData[league].push(item);
                    }
                }
            }
        }
        const insertData = await rankTranslator(newData);
        await rankDao.post(insertData);
        list[leagueList[0]] = data[leagueList[0]];
        await redisClient.set("prevRankList", JSON.stringify(list));
    }
};
