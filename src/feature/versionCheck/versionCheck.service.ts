
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";

interface versionCheckReqDto {
    appVersion: string
}


export const versionCheckService = {
    post: async (version: versionCheckReqDto) => {
        let check: boolean;
        if (version.appVersion !== "1.3.6") {
            check = false;
        } else {
            check = true;
        }
        const res: BaseApiResponse<boolean> = {
            ...status.SUCCESS.body,
            result: check
        };
        return res;

    }
};
