import express from "express";
import cors from "cors";

import { tokenMinddleware } from "@src/utils/jwt.middleware";
import asyncHandler from "express-async-handler";
import { config } from "dotenv";
import { matchRouter } from "@route/match/match.route";
import { mainRouter } from "@route/main/main.route";
import { teamRouter } from "@route/team/team.route";
import { isSelectedRouter } from "@route/isSelected/isSelected.route";
import { iconRouter } from "@route/icon/icon.route";
import { authRouter } from "@route/auth/IAM.route";
import { fcmTokenRouter } from "@route/fcmToken/fcmToken.route";
import { leagueRouter } from "@route/league/league.route";
import { schedulerRouter } from "@route/scheduler/scheduler.route";
import { matchDataRouter } from "@route/matchData/matchData.route";
import { searchTagRouter } from "@route/searchTag/searchTag.route";
import { versionCheckRouter } from "@route/versionCheck/versionCheck.route";
import { initTask } from "@src/task/init/init.task";
import { syncRouter } from "@route/sync/sync.route";

config();

export default function App() {
    const app = express();
    app.use(cors()); // cors 방식 허용
    app.use(express.static("public")); // 정적 파일 접근
    app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
    app.use(express.urlencoded({ extended: false }));
    app.use("/auth", asyncHandler(authRouter));
    app.use("/fcmToken", asyncHandler(tokenMinddleware.auth), asyncHandler(fcmTokenRouter));
    app.use("/main", asyncHandler(tokenMinddleware.auth), asyncHandler(mainRouter));
    app.use("/team", asyncHandler(tokenMinddleware.auth), asyncHandler(teamRouter));
    app.use("/match", asyncHandler(tokenMinddleware.auth), asyncHandler(matchRouter));
    app.use("/icon", asyncHandler(tokenMinddleware.auth), asyncHandler(iconRouter));
    app.use("/isSelected", asyncHandler(tokenMinddleware.auth), asyncHandler(isSelectedRouter));
    app.use("/league", asyncHandler(tokenMinddleware.auth), asyncHandler(leagueRouter));
    app.use("/icon", asyncHandler(tokenMinddleware.auth), asyncHandler(iconRouter));
    app.use("/scheduler", asyncHandler(schedulerRouter));
    app.use("/matchData", asyncHandler(matchDataRouter));
    app.use("/searchTag", asyncHandler(searchTagRouter));
    app.use("/versionCheck", asyncHandler(versionCheckRouter));
    app.use("/sync", asyncHandler(syncRouter));

    // chackDailyMatch를 1분마다 실행

    initTask();

    return app;
}
