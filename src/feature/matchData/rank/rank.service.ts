import redisClient from "../../../../config/db.redis";
import { rankDao } from "../../../models/matchData/rank/rank.dao";
import { postRankReqDto } from "../../../models/matchData/rank/rank.dto";
import { rankTranslator } from "../../../utils/matchData";

export const rankService = {
    post: async (data: postRankReqDto) => {
        const prevRankList = await redisClient.get("prevRankList") as string;
        const list = JSON.parse(prevRankList) as postRankReqDto;
        const leagueList = Object.keys(data);
        const newData: postRankReqDto = {};
        console.log(leagueList);
        for (const league of leagueList) {
            console.log(league);
            if (!newData[league]) newData[league] = [];
            for (const item of data[league]) {
                if (!newData[league].includes(item)) {
                    newData[league].push(item);
                }
            }
        }

        const insertData = await rankTranslator(newData);
        await rankDao.post(insertData);
        list[leagueList[0]] = data[leagueList[0]];
        await redisClient.set("prevRankList", JSON.stringify(list));
    }
};
