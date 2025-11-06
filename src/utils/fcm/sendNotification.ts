import { messaging } from "../../../config/firebase";
import { highlightInfoDto } from "../../models/fcm/fcm.dto";

export async function sendFCMToManyDevices(
    tokens: string[],
    item: highlightInfoDto
) {
    const BATCH_SIZE = 500; // 한 번에 보내는 토큰의 수
    for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
        const batch = tokens.slice(i, i + BATCH_SIZE); // 배치로 나누기
        const message = {

            /* notification: {
                title: "하이라이트",
                body: `${item.homeTeamName} vs ${item.awayTeamName}`
            },*/
            data: {
                screen: "match",
                matchId: String(item.matchId)
            },
            tokens: batch,
            android: {
                priority: "high" as const,
                notification: {
                    channelId: "default",
                    sound: "default",
                    notificationCount: 1
                }
            },
            apns: {
                payload: {
                    aps: {
                        alert: {
                            title: "하이라이트",
                            body: `${item.homeTeamName} vs ${item.awayTeamName}`
                        },
                        sound: "default",
                        contentAvailable: true
                    }
                },
                headers: {
                    "apns-priority": "10" // 10은 즉시 전송
                }
            }
        };
        try {
            // sendEachForMulticast 사용 (보내는 대상이 여러 개일 경우)
            const response = await messaging.sendEachForMulticast(message);
            if (response.failureCount > 0) {
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        console.warn(`❌ 실패한 토큰 [${batch[idx]}]:`, resp.error);
                    }
                });
            }
        } catch (error) {
            console.error(`❌ FCM 전송 오류 (Batch ${(i / BATCH_SIZE) + 1}):`, error);
        }
    }
}
export async function sendFCMToManyDevicesLive(
    tokens: string[],
    item: highlightInfoDto
) {
    const BATCH_SIZE = 500; // 한 번에 보내는 토큰의 수
    for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
        const batch = tokens.slice(i, i + BATCH_SIZE); // 배치로 나누기
        const message = {

            /* notification: {
                title: "경기 시작!",
                body: `${item.homeTeamName} vs ${item.awayTeamName}`
            },*/
            data: {
                screen: "match",
                matchId: String(item.matchId)
            },
            tokens: batch,
            android: {
                priority: "high" as const,
                notification: {
                    channelId: "default",
                    sound: "default",
                    notificationCount: 1
                }
            },
            apns: {
                payload: {
                    aps: {
                        alert: {
                            title: "경기가 시작했습니다!",
                            body: `${item.homeTeamName} vs ${item.awayTeamName}`
                        },
                        sound: "default",
                        contentAvailable: true
                    }
                },
                headers: {
                    "apns-priority": "10" // 10은 즉시 전송
                }
            }
        };
        try {
            // sendEachForMulticast 사용 (보내는 대상이 여러 개일 경우)
            const response = await messaging.sendEachForMulticast(message);
            if (response.failureCount > 0) {
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        console.warn(`❌ 실패한 토큰 [${batch[idx]}]:`, resp.error);
                    }
                });
            }
        } catch (error) {
            console.error(`❌ FCM 전송 오류 (Batch ${(i / BATCH_SIZE) + 1}):`, error);
        }
    }
}
