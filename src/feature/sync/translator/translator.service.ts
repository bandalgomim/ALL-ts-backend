/* eslint-disable @stylistic/max-len */
import { translatorDao } from "@src/models/sync/translator/translator.dao";
import { translatorDto } from "@src/models/sync/translator/translator.dto";
import { parseRelativeDate, parseRelativeType } from "@src/utils/translator";

export const translatorService = {
    post: async (data: translatorDto[]) => {
        console.log(data);
        const translatedData = [];
        for (const item of data) {
            const tag = await translatorDao.getTag(item.leagueId);
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
            item.matchId = await translatorDao.getMatchId(item);
            console.log("in translatorService | homeTeam: ", homeTag, " | awayTeamId: ", awayTag, item.date ? item.date : "no date");
            console.log("in translatorService | matchId: ", item.matchId ? item.matchId : "⚠️  Team id error", " | homeTeamId: ", homeTag, " | awayTeamId: ", awayTag, item.date ? item.date : "no date", "\n");
            item.type = parseRelativeType(item.type) as string;
            translatedData.push(item);
        }
        const res = await translatorDao.post(translatedData);
        return res;

    }
};
