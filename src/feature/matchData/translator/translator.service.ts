import redisClient from "../../../../config/db.redis";
import { getTagDao } from "../../../models/matchData/getTag/getTag.dao";
import { uriDto } from "../../../models/matchData/uri/uri.dto";
import { mergePrevUri } from "../../../utils/prevData";

export const uriService = {
    post: async (data) => {
        const teamTag = await getTagDao.getTeamTag();
        const leagueTag = await getTagDao.getLeagueTag();
        const platformTag = await getTagDao.getPlatformTag();
        const translatedData = [];
        for (const item in data) {
            item.league = leagueTag.find(tag => tag.id === item.league)?.name || item.league;
        }

        // prevUriList를 저장하거나 반환 등 필요한 작업 수행
        await redisClient.set(`prevUriList_${date}`, JSON.stringify(prevUriList));
        return data;
    }
};