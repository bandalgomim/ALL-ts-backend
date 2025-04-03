"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainService = void 0;
const main_dao_1 = require("../../models/main/main.dao");
const response_status_1 = require("../../../config/response.status");
const moment_1 = __importDefault(require("moment"));
exports.mainService = {
    get: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield main_dao_1.mainDao.get(userId); // dao의 정보를 반환
        const matchList = []; // 각 항목이 들어갈 배열을 생성
        const teamList = [];
        const leagueList = [];
        result.map((data) => {
            if (data.match_id !== null && data.is_match_selected !== 0) {
                matchList.push({
                    matchId: data.match_id,
                    matchDate: moment_1.default.utc(data.match_date).tz("Asia/Seoul")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    matchState: data.match_state,
                    homeTeamId: data.home_team_id,
                    awayTeamId: data.away_team_id,
                    homeTeamName: data.home_team_name,
                    awayTeamName: data.away_team_name,
                    homeTeamInit: data.home_team_initial,
                    awayTeamInit: data.away_team_initial,
                    hometeamLogo: data.home_team_logo,
                    awayteamLogo: data.away_team_logo,
                    homeTeamScore: data.home_team_score,
                    awayTeamScore: data.away_team_score,
                    userId: data.user_id,
                    isMatchSelected: Boolean(data.is_match_selected)
                });
            }
            if (data.team_id !== null && data.is_team_selected !== 0) {
                teamList.push({
                    teamId: data.team_id,
                    teamName: data.team_name,
                    teamLogo: data.team_logo,
                    index: data.team_index
                });
            }
            if (data.league_id !== null && data.is_league_selected !== 0) {
                leagueList.push({
                    leagueId: data.league_id,
                    leagueName: data.league_name,
                    leagueLogo: data.league_logo,
                    index: data.league_index
                });
            }
        });
        const res = Object.assign(Object.assign({}, response_status_1.status.SUCCESS.body), { result: {
                matchList: matchList,
                teamAndLeagueList: [...teamList, ...leagueList].sort((a, b) => a.index - b.index)
            } });
        return res;
    }),
    patch: (userId, index) => __awaiter(void 0, void 0, void 0, function* () {
        yield main_dao_1.mainDao.patch(userId, index);
        const res = Object.assign(Object.assign({}, response_status_1.status.SUCCESS.body), { result: null });
        return res;
    })
};
