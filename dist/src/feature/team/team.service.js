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
exports.teamService = void 0;
const team_dao_1 = require("@models/team/team.dao");
const response_status_1 = require("../../../config/response.status");
exports.teamService = {
    get: (userId, teamId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield team_dao_1.teamDao.get(userId, teamId);
        const matchList = {};
        let matchItems = [];
        let prevDate = null;
        if (result[0].match_id) {
            result.forEach((data) => {
                if (data.match_id !== null) {
                    if (prevDate && prevDate !== data.match_date.split(' ')[0]) {
                        matchList[prevDate] = matchItems;
                        matchItems = [];
                    }
                    matchItems.push({
                        matchId: data.match_id,
                        matchDate: data.match_date.split(' ')[0],
                        matchTime: data.match_date.split(' ')[1],
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
            });
            // 마지막 날짜의 matchItems도 추가
            if (matchItems.length > 0 && prevDate) {
                matchList[prevDate] = matchItems;
            }
        }
        const res = Object.assign(Object.assign({}, response_status_1.status.SUCCESS.body), { result: {
                team: {
                    teamId: result[0].team_id,
                    teamName: result[0].team_name,
                    teamInit: result[0].team_initial,
                    teamLogo: result[0].team_logo,
                    rank: result[0].rank,
                    win: result[0].win,
                    draw: result[0].draw,
                    lose: result[0].lose,
                    point: result[0].point,
                    section: result[0].section,
                    leagueId: result[0].league_id,
                    leagueName: result[0].league_name,
                    sportId: result[0].sport_id,
                    sportName: result[0].sport_name,
                    countryId: result[0].country_id,
                    countryName: result[0].country_name,
                    isTeamSelected: Boolean(result[0].is_team_selected)
                },
                matchList: matchList // 날짜별로 묶인 matchList
            } });
        return res;
    })
};
