import { searchTagDao } from "@models/searchTag/serchTag.dao";
import redisClient from "../../../config/db.redis";
import { type searchTagResDto } from "@models/searchTag/serchTag.dto";
import { type BaseApiResponse } from "../../../config/response";
import { status } from "../../../config/response.status";

export const searchTagService = {
  get: async () => {
    const result = await redisClient.get("searchTag");
    const res: BaseApiResponse<searchTagResDto> = {
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
