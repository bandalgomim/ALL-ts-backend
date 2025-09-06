"use strict";
/* import redisClient from "../../../../config/db.redis";
import { rankDao } from "../../models/rank/rank.dao";
import { postRankReqDto } from "../../../models/matchData/rank/rank.dto";
import { matchDataTranslator } from "../../../utils/matchData";

export const rankService = {
    post: async (data: postRankReqDto) => {
        const prevRankList = await redisClient.get("prevRankList") as string;
        const list = JSON.parse(prevRankList) as postRankReqDto;
        const leagueList = Object.keys(data);
        const newData: postRankReqDto = {};
        for (const league in leagueList) {
            // data에만 있는 값 newData에 추가
            if (!newData[league]) newData[league] = [];
            for (const item of data[league]) {
                if (!newData[league].includes(item)) {
                    newData[league].push(item);
                }
            }
        }
        const insertData = await matchDataTranslator(newData);
        await rankDao.post(insertData);
        list[leagueList[0]] = data[leagueList[0]];
        await redisClient.set("prevRankList", JSON.stringify(list));
    }
};*/
