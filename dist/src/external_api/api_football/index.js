"use strict";
/**
 * API Football 모듈 내보내기
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiFootballTeamData = exports.apiFootballSeasonInfo = exports.apiFootballRankInfo = exports.apiFootballMatchToday = exports.apiFootballMatchInfo = void 0;
__exportStar(require("./dto"), exports);
var api_football_match_1 = require("./api-football-match");
Object.defineProperty(exports, "apiFootballMatchInfo", { enumerable: true, get: function () { return api_football_match_1.apiFootballMatchInfo; } });
var api_football_match_today_1 = require("./api-football-match-today");
Object.defineProperty(exports, "apiFootballMatchToday", { enumerable: true, get: function () { return api_football_match_today_1.apiFootballMatchToday; } });
var api_football_rank_1 = require("./api-football-rank");
Object.defineProperty(exports, "apiFootballRankInfo", { enumerable: true, get: function () { return api_football_rank_1.apiFootballRankInfo; } });
var api_football_season_1 = require("./api-football-season");
Object.defineProperty(exports, "apiFootballSeasonInfo", { enumerable: true, get: function () { return api_football_season_1.apiFootballSeasonInfo; } });
var api_football_team_data_1 = require("./api-football-team-data");
Object.defineProperty(exports, "apiFootballTeamData", { enumerable: true, get: function () { return api_football_team_data_1.apiFootballTeamData; } });
