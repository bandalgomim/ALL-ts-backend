"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulerSql = void 0;
exports.schedulerSql = {
    get: `SELECT
        l.league_id as leagueId,
        s.season_id as seasonId,
        l.league_name as leagueName
    FROM
        league l
    JOIN
        season s ON l.league_id = s.league_id AND s.season_state = 1
    WHERE
        l.is_active = 1`
};
