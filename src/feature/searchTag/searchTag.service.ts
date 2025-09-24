import { searchTagDao } from "../../models/searchTag/serchTag.dao";
import redisClient from "../../../config/db.redis";
import { searchTagResDto } from "../../models/searchTag/serchTag.dto";

export const searchTagService = {
    patch: async () => {
        const result = await searchTagDao.patch(); // dao의 정보를 반환
        const searchTag: searchTagResDto = [];
        result.forEach((data) => {
            searchTag.push({
                teamId: data.teamId,
                leagueId: data.leagueId,
                tag: data.tag,
                itemName: data.itemName
            });
        });
        await redisClient.set("searchTag", JSON.stringify(searchTag)); // redis에 저장
    }
};
