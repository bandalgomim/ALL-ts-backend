"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jwt_middleware_1 = require("./utils/jwt.middleware");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = require("dotenv");
const match_route_1 = require("./route/match/match.route");
const main_route_1 = require("./route/main/main.route");
const team_route_1 = require("./route/team/team.route");
const isSelected_route_1 = require("./route/isSelected/isSelected.route");
const icon_route_1 = require("./route/icon/icon.route");
const IAM_route_1 = require("./route/auth/IAM.route");
const fcmToken_route_1 = require("./route/fcmToken/fcmToken.route");
const league_route_1 = require("./route/league/league.route");
const matchData_route_1 = require("./route/matchData/matchData.route");
const searchTag_route_1 = require("./route/searchTag/searchTag.route");
const versionCheck_route_1 = require("./route/versionCheck/versionCheck.route");
const init_task_1 = require("./task/init/init.task");
(0, dotenv_1.config)();
function App() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)()); // cors 방식 허용
    app.use(express_1.default.static("public")); // 정적 파일 접근
    app.use(express_1.default.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use("/auth", (0, express_async_handler_1.default)(IAM_route_1.authRouter));
    app.use("/fcmToken", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.auth), (0, express_async_handler_1.default)(fcmToken_route_1.fcmTokenRouter));
    app.use("/main", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.auth), (0, express_async_handler_1.default)(main_route_1.mainRouter));
    app.use("/team", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.auth), (0, express_async_handler_1.default)(team_route_1.teamRouter));
    app.use("/match", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.auth), (0, express_async_handler_1.default)(match_route_1.matchRouter));
    app.use("/icon", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.auth), (0, express_async_handler_1.default)(icon_route_1.iconRouter));
    app.use("/isSelected", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.auth), (0, express_async_handler_1.default)(isSelected_route_1.isSelectedRouter));
    app.use("/league", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.auth), (0, express_async_handler_1.default)(league_route_1.leagueRouter));
    app.use("/icon", (0, express_async_handler_1.default)(jwt_middleware_1.tokenMinddleware.auth), (0, express_async_handler_1.default)(icon_route_1.iconRouter));
    app.use("/matchData", (0, express_async_handler_1.default)(matchData_route_1.matchDataRouter));
    app.use("/searchTag", (0, express_async_handler_1.default)(searchTag_route_1.searchTagRouter));
    app.use("/versionCheck", (0, express_async_handler_1.default)(versionCheck_route_1.versionCheckRouter));
    // chackDailyMatch를 1분마다 실행
    (0, init_task_1.initTask)();
    return app;
}
