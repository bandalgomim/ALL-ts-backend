import express from "express";
import cors from "cors";

import { tokenMinddleware } from "./utils/jwt.middleware";
import asyncHandler from "express-async-handler";
import { config } from "dotenv";
import { teamRouter } from "./route/team/team.route";
import { mainRouter } from "./route/main/main.route";


config();

export default function App() {
    const app = express();
    app.use(cors()); // cors 방식 허용
    app.use(express.static("public")); // 정적 파일 접근
    app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
    app.use(express.urlencoded({ extended: false }));
    app.use("/main", asyncHandler(tokenMinddleware.auth), asyncHandler(mainRouter));
    app.use("/team", asyncHandler(tokenMinddleware.auth), asyncHandler(teamRouter));
    return app;
}
