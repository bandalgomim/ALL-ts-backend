
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";

interface versionCheckReqDto {
    appVersion: string
}


export const versionCheckService = {
    post: async (version: versionCheckReqDto) => {
        let check: boolean;
        if (version.appVersion === "1.4") {
            check = true;
        } else {
            check = false;
        }
        const res: BaseApiResponse<boolean> = {
            ...status.SUCCESS.body,
            result: check
        };
        return res;

    }
};
