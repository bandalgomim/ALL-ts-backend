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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainService = void 0;
const main_dao_1 = require("../../models/main/main.dao");
const response_status_1 = require("../../../config/response.status");
exports.mainService = {
    get: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield main_dao_1.mainDao.get(userId); // dao의 정보를 반환
        const matchList = {};
        let matchItems = [];
        let prevDate = null;
        const teamList = [];
        const leagueList = [];
        result.forEach((data) => {
            if (data.match_id !== null && data.is_match_selected !== 0) {
                if (prevDate && prevDate !== data.match_date.split(" ")[0]) {
                    matchList[prevDate] = matchItems;
                    matchItems = [];
                }
                matchItems.push({
                    matchId: data.match_id,
                    matchDate: data.match_date.split(" ")[0],
                    matchTime: data.match_date.split(" ")[1],
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
                prevDate = data.match_date.split(" ")[0];
            }
            if (data.team_id !== null && data.is_team_selected !== 0) {
                teamList.push({
                    teamId: data.team_id,
                    teamName: data.team_name,
                    teamInit: data.team_initial,
                    teamLogo: data.team_logo,
                    index: data.team_index
                });
            }
            if (data.league_id !== null && data.is_league_selected !== 0) {
                leagueList.push({
                    leagueId: data.league_id,
                    leagueName: data.league_name,
                    leagueInit: data.league_initial,
                    leagueLogo: data.league_logo,
                    index: data.league_index
                });
            }
        });
        // 마지막 날짜의 matchItems도 추가
        if (matchItems.length > 0 && prevDate) {
            matchList[prevDate] = matchItems;
        }
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
