import { fcmDao } from "@models/fcm/fcm.dao";
import { highlightInfoDto } from "@models/fcm/fcm.dto";
import { sendFCMToManyDevices, sendFCMToManyDevicesLive } from "@feature/fcm/sentNotification.service";

export const sentNotification = async (matchId: string) => {
    const result = await fcmDao.get(matchId);
    const highlightInfo: highlightInfoDto = {
        matchId: result[0].match_id,
        homeTeamName: result[0].home_team_name,
        awayTeamName: result[0].away_team_name
    };
    let tokens = await fcmDao.getFcmToken(matchId);
    tokens = Array.from(new Set(tokens));
    if (tokens.length !== 0) {
        console.log("Sending FCM notifications to tokens:", tokens);
        await sendFCMToManyDevices(tokens, highlightInfo);
    }
};

export const sentNotificationLive = async (matchId: string) => {
    if (!matchId) return;
    const result = await fcmDao.getLive(matchId);
    console.log("Live match info result:", result[0].home_team_name, result[0].away_team_name);
    if (!result[0]) return;
    const highlightInfo: highlightInfoDto = {
        matchId: result[0].match_id,
        homeTeamName: result[0].home_team_name,
        awayTeamName: result[0].away_team_name
    };
    let tokens = await fcmDao.getFcmToken(matchId);
    console.log("Live match FCM tokens:", tokens);
    tokens = Array.from(new Set(tokens));
    if (tokens.length !== 0) {
        await fcmDao.postLiveAlarm(matchId);
        await sendFCMToManyDevicesLive(tokens, highlightInfo);
    }
};
