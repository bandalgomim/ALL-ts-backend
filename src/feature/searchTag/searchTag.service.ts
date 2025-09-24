import { searchTagDao } from "../../models/searchTag/serchTag.dao";
import redisClient from "../../../config/db.redis";
import { searchTagResDto } from "../../models/searchTag/serchTag.dto";
import { BaseApiResponse } from "../../../config/response";
import { getMainDto } from "../../models/main/main.dto";
import { status } from "../../../config/response.status";

export const searchTagService = {
    get: async () => {
        const result = await redisClient.get("searchTag");
        const res: BaseApiResponse<getMainDto> = {
            ...status.SUCCESS.body,
            result: result ? JSON.parse(result) : []
        };
        return res;
    },
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
