import redisClient from "../../../../config/db.redis";
import { uriDto } from "../../../models/matchData/uri/uri.dto";
import { mergePrevUri } from "../../../utils/prevData";

export const uriService = {
    post: async (data: uriDto, date: string) => {
        const prevUriList = JSON.parse(await redisClient.get(`prevUriList_${date}`) as string);
        const mergedPrevUri = await mergePrevUri(date);

        // 1. data와 mergedPrevUri 비교
        for (const platform in data) {
            for (const league in data[platform]) {
                // data와 mergedPrevUri에 모두 있는 값 삭제
                if (mergedPrevUri[platform]?.[league]) {
                    data[platform][league] = data[platform][league].filter(
                        (item: string) => !mergedPrevUri[platform][league].includes(item)
                    );
                }

                // data에만 있는 값 prevUriList에 추가
                if (!prevUriList[platform]) prevUriList[platform] = {};
                if (!prevUriList[platform][league]) prevUriList[platform][league] = [];
                for (const item of data[platform][league]) {
                    if (!prevUriList[platform][league].includes(item)) {
                        prevUriList[platform][league].push(item);
                    }
                }
            }
        }

        // prevUriList를 저장하거나 반환 등 필요한 작업 수행
        await redisClient.set(`prevUriList_${date}`, JSON.stringify(prevUriList));
        return data;
    }
};
