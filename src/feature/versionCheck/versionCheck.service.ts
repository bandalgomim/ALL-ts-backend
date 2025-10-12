
import { status } from "../../../config/response.status";
import { BaseApiResponse } from "../../../config/response";

interface versionCheckReqDto {
    appVersion: string
}


export const versionCheckService = {
    post: async (version: versionCheckReqDto) => {

        console.log(version);

        let check: boolean;
        if (version.appVersion !== "1.3.5") {
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
