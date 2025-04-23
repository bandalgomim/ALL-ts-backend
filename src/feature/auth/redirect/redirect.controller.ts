import { Request, Response } from "express";
import { tokenMinddleware } from "../../../utils/jwt.middleware";

export const redirectController = {

    naver: async (req: Request, res: Response) => {
        // URL에서 code와 state를 추출
        const code = req.query.code;  // 예: ?code=jFU1XfdIG9ffp9trs6
        const state = req.query.state;  // 예: ?state=test

        await tokenMinddleware.naver(req, res, () => {});
        console.log("res.locals", res.locals);

        // TODO: code를 이용하여 액세스 토큰 요청
        // 예시: 결과를 클라이언트에게 JSON으로 응답
        res.json({ code, state });
    }
};
