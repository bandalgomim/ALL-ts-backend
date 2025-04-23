import { Request, Response } from "express";

export const redirectController = {

    naver: async (req: Request, res: Response) => {
        // URL에서 code와 state를 추출
        res.json({
            code: req.query.code,
            state: req.query.state
        });

        // res.redirect(`com.ALLts:/oauthredirect?code=${req.query.code}&state=${req.query.state}`);
    }
};
