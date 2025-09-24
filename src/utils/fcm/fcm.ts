import { fcmDao } from "../../models/fcm/fcm.dao";
import { highlightInfoDto } from "../../models/fcm/fcm.dto";
import { sendFCMToManyDevices } from "./sendNotification";

export const sentNotifi = async (matchId: string) => {
    const result = await fcmDao.get(matchId);
    const highlightInfo: highlightInfoDto = {
        matchId: result[0].match_id,
        homeTeamName: result[0].home_team_name,
        awayTeamName: result[0].away_team_name
    };
    let tokens = await fcmDao.getFcmToken(matchId);
    console.log(highlightInfo, tokens);
    tokens = Array.from(new Set(tokens));
    if (tokens.length !== 0) {
        await sendFCMToManyDevices(tokens, highlightInfo);
    }
};
