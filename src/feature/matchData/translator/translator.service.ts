import { getTagDao } from "../../../models/matchData/getTag/getTag.dao";
import { translatorListDto } from "../../../models/matchData/translator/translator.dto";
import { parseRelativeDate, parseRelativeType } from "../../../utils/translator";

export const translatorService = {
    post: async (data: translatorListDto) => {
        const teamTag = await getTagDao.getTeamTag();
        const leagueTag = await getTagDao.getLeagueTag();
        const platformTag = await getTagDao.getPlatformTag();
        const translatedData = [];
        for (const item of data) {
            // leagueTag의 league_tag와 item.leagueId를 비교해야 함
            item.leagueId = leagueTag.find((tag) => tag.league_tag === item.leagueId)?.league_id || item.leagueId;
            // eslint-disable-next-line @stylistic/max-len
            item.platformId = platformTag.find((tag) => tag.platform_tag === item.platformId)?.platform_id || item.platformId;
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
            item.date = parseRelativeDate(item.date);
            item.type = parseRelativeType(item.type) as string;
            translatedData.push(item);
        }
        console.log("Translated Data:", translatedData);

        // prevUriList를 저장하거나 반환 등 필요한 작업 수행

    }
};
