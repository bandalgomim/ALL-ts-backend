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
exports.leagueService = void 0;
const league_dao_1 = require("../../models/league/league.dao");
const response_status_1 = require("../../../config/response.status");
exports.leagueService = {
    get: (userId, leagueId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield league_dao_1.leagueDao.get(userId, leagueId);
        const league = {
            leagueId: result[0].league_id,
            leagueName: result[0].league_name,
            leagueInit: result[0].league_initial,
            leagueLogo: result[0].league_logo,
            sportId: result[0].sport_id,
            sportName: result[0].sport_name,
            countryId: result[0].country_id,
            countryName: result[0].country_name,
            isSelected: Boolean(result[0].is_league_selected)
        };
        const teamList = [];
        const matchList = {};
        let matchItems = [];
        let prevDate = null;
        result.forEach((data) => {
            if (data.match_id !== null) {
                const currDate = new Date(data.match_date).toISOString()
                    .split("T")[0];
                if (prevDate && prevDate !== currDate) {
                    matchList[prevDate] = matchItems;
                    matchItems = [];
                }
                matchItems.push({
                    matchId: data.match_id,
                    matchDate: currDate,
                    matchTime: data.match_time,
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
                prevDate = currDate;
            }
            else {
                teamList.push({
                    teamId: data.team_id,
                    teamName: data.team_name,
                    teamInit: data.team_initial,
                    teamLogo: data.team_logo,
                    rank: data.rank,
                    win: data.win,
                    draw: data.draw,
                    lose: data.lose,
                    point: data.point,
                    section: data.section
                });
            }
        });
        // 마지막 날짜의 matchItems도 추가
        if (matchItems.length > 0 && prevDate) {
            matchList[prevDate] = matchItems;
        }
        const res = Object.assign(Object.assign({}, response_status_1.status.SUCCESS.body), { result: {
                league: league,
                teamList: teamList,
                matchList: matchList // 날짜별로 묶인 matchList
            } });
        return res;
    })
};
