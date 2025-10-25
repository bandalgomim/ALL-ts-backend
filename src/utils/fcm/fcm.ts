import { fcmDao } from "../../models/fcm/fcm.dao";
import { highlightInfoDto } from "../../models/fcm/fcm.dto";
import { sendFCMToManyDevices, sendFCMToManyDevicesLive } from "./sendNotification";

export const sentNotifi = async (matchId: string) => {
    console.log("Preparing to send FCM notification for matchId:", matchId);
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

export const sentNotifiLive = async (matchId: string) => {
    if (!matchId) return;
    const result = await fcmDao.getLive(matchId);
    const highlightInfo: highlightInfoDto = {
        matchId: result[0].match_id,
        homeTeamName: result[0].home_team_name,
        awayTeamName: result[0].away_team_name
    };
    let tokens = await fcmDao.getFcmToken(matchId);
    tokens = Array.from(new Set(tokens));
    if (tokens.length !== 0) {
        await fcmDao.postLiveAlarm(matchId);
        await sendFCMToManyDevicesLive(tokens, highlightInfo);
    }
};
