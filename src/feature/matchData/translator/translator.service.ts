/* eslint-disable @stylistic/max-len */
import { getMatchIdDao } from "@models/matchData/getMatchId/getMatchId.dao";
import { translatorDao } from "@models/matchData/translator/translator.dao";
import { translatorDto } from "@models/matchData/translator/translator.dto";
import { parseRelativeDate, parseRelativeType } from "@src/utils/translator";

export const translatorService = {
    post: async (data: translatorDto[]) => {
        const translatedData = [];
        for (const item of data) {
            const tag = await translatorDao.get(item.leagueId);
            item.leagueId = tag[0].league_id;
            const homeTag = item.homeTeamId;
            const awayTag = item.awayTeamId;
            if (homeTag === "TBD" || awayTag === "TBD") {
                continue;
            }
            let homeTeamId = homeTag;
            let awayTeamId = awayTag;

            for (const tagItem of tag) {
                if (tagItem.team_name === homeTag || tagItem.team_initial === homeTag || tagItem.tag === homeTag) homeTeamId = tagItem.team_id;
                if (tagItem.team_name === awayTag || tagItem.team_initial === awayTag || tagItem.tag === awayTag) awayTeamId = tagItem.team_id;
                if (homeTeamId !== homeTag && awayTeamId !== awayTag) break;
            }
            item.homeTeamId = homeTeamId;
            item.awayTeamId = awayTeamId;
            item.date = parseRelativeDate(item.date);
            item.matchId = await getMatchIdDao.get(item.leagueId, item.homeTeamId, item.awayTeamId, item.doubleHeader);
            console.log("in translatorService | homeTeam: ", item.homeTeamId, " | awayTeamId: ", item.awayTeamId, item.date ? item.date : "no date");
            console.log("in translatorService | matchId: ", item.matchId ? item.matchId : "⚠️  Team id error", " | homeTeamId: ", item.homeTeamId, " | awayTeamId: ", item.awayTeamId, item.date ? item.date : "no date", "\n");
            item.type = parseRelativeType(item.type) as string;
            translatedData.push(item);
        }
        await translatorDao.post(translatedData);

        // prevUriList를 저장하거나 반환 등 필요한 작업 수행

    }
};
