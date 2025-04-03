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
exports.leagueService = void 0;
const league_dao_1 = require("../../models/league/league.dao");
const response_status_1 = require("../../../config/response.status");
const moment_1 = __importDefault(require("moment"));
exports.leagueService = {
    get: (userId, leagueId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield league_dao_1.leagueDao.get(userId, leagueId); // dao의 정보를 반환
        const league = {
            leagueId: result[0].league_id,
            leagueName: result[0].league_name,
            leagueLogo: result[0].league_logo,
            sportId: result[0].sport_id,
            sportName: result[0].sport_name,
            countryId: result[0].country_id,
            countryName: result[0].country_name,
            isSelected: Boolean(result[0].is_league_selected)
        }; // 각 항목이 들어갈 배열을 생성
        const teamList = [];
        const matchList = [];
        result.map((data) => {
            if (data.match_id !== null) {
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
            else {
                teamList.push({
                    teamId: data.team_id,
                    teamName: data.team_name,
                    teamInit: data.team_initial,
                    teamLogo: data.team_logo
                });
            }
        });
        const res = Object.assign(Object.assign({}, response_status_1.status.SUCCESS.body), { result: {
                league: league,
                teamList: teamList,
                matchList: matchList.reverse()
            } });
        return res;
    })
};
