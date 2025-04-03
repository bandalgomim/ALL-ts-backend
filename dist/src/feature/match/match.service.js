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
exports.matchService = void 0;
const match_dao_1 = require("../../models/match/match.dao");
const response_status_1 = require("../../../config/response.status");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.matchService = {
    get: (matchId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield match_dao_1.matchDao.get(matchId); // dao의 정보를 반환
        const platform = [];
        result.map((data) => {
            // 매핑을 통해 배열에 알맞은 오브젝트를 생성 후 push
            platform.push({
                platformId: data.platform_id,
                platformName: data.platform_name,
                platformlogo: data.platform_logo,
                platformUrl: data.platform_url
            });
        });
        const res = Object.assign(Object.assign({}, response_status_1.status.SUCCESS.body), { result: {
                matchId: result[0].match_id,
                matchDate: moment_timezone_1.default.utc(result[0].match_date).tz("Asia/Seoul")
                    .format("YYYY-MM-DD HH:mm:ss"),
                homeTeamId: result[0].home_team_id,
                awayTeamId: result[0].away_team_id,
                homeTeamName: result[0].home_team_name,
                awayTeamName: result[0].away_team_name,
                homeTeamInit: result[0].home_team_initial,
                awayTeamInit: result[0].away_team_initial,
                hometeamLogo: result[0].home_team_logo,
                awayteamLogo: result[0].away_team_logo,
                homeTeamScore: result[0].home_team_score,
                awayTeamScore: result[0].away_team_score,
                sportName: result[0].sport_name,
                homeCountryName: result[0].home_country_name,
                awayCountryName: result[0].away_country_name,
                homeLeagueName: result[0].home_league_name,
                awayLeagueName: result[0].away_league_name,
                matchState: result[0].match_state,
                isMatchSelected: Boolean(result[0].is_match_selected),
                platform: platform
            } });
        return res;
    })
};
