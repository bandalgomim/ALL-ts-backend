import redisClient from "../../../config/db.redis";
import { fcmDao } from "../../models/fcm/fcm.dao";
import { chackDailyMatchDto } from "../../models/fcm/fcm.dto";
import { sendFCMToManyDevices } from "./sendNotification";


export const chackDailyMatch = async () => {
    const list = await redisClient.get("matchList");
    const today = getLocalDateString();
    const result = await fcmDao.chackDailyMatch(today);
    if (list === null) {
        await redisClient.set("matchList", JSON.stringify([]));
    } else if (Array.isArray(result) && result.length === 0) {
        await redisClient.set("matchList", JSON.stringify(result));
    } else {
        const parsedList = JSON.parse(list);
        const new_match = [];
        for (const resultMatch of result) {
            const exists = parsedList.some((listMatch: chackDailyMatchDto) =>
                listMatch.match_id === resultMatch.match_id);
            if (!exists) {
                new_match.push(resultMatch);
            }
        }
        const updatedList = parsedList.filter((listMatch: chackDailyMatchDto) =>
            result.some((resultMatch) => resultMatch.match_id === listMatch.match_id));
        for (const newItem of new_match) {
            let tokens = await fcmDao.getFcmToken(newItem.match_id);

            // 중복 제거
            tokens = Array.from(new Set(tokens));
            if (tokens.length !== 0) {
                await sendFCMToManyDevices(tokens, newItem as chackDailyMatchDto);
            }
        }
        await redisClient.set("matchList", JSON.stringify([ ...updatedList, ...new_match ]));
    }
};

export const getLocalDateString = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // getMonth()는 0부터 시작하므로 +1
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

