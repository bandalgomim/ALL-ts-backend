"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulerSql = void 0;
exports.schedulerSql = {
    get: `SELECT
        l.league_id as leagueId,
        s.season_id as seasonId
    FROM
        league l
    JOIN
        season s ON l.league_id = s.league_id AND s.season_state = 1
    WHERE
        l.is_active = 1`,
    post: (data) => {
        return `INSERT INTO match_info (match_id, league_id, home_team_id, away_team_id, match_date, match_state, home_team_score, away_team_score, double_header, season_id) 
        VALUES ${data}
    ON DUPLICATE KEY UPDATE
        league_id = VALUES(league_id),
        home_team_id = VALUES(home_team_id),
        away_team_id = VALUES(away_team_id),
        match_date = VALUES(match_date),
        match_state = VALUES(match_state),
        home_team_score = VALUES(home_team_score),
        away_team_score = VALUES(away_team_score),
        double_header = VALUES(double_header),
        season_id = VALUES(season_id);`;
    },
    getSupplement: `SELECT 
        match_id
    FROM 
        match_info
    WHERE
        DATE_FORMAT(match_date, '%Y-%m') = ?
    `,
    getUserMatchList: (teamId, minDate, maxDate) => {
        return `INSERT INTO match_list (user_id, match_id, is_selected)
        SELECT tl.user_id, mi.match_id, 1
        FROM match_info mi
        JOIN team_list tl
        ON tl.is_selected = 1 AND tl.team_id = mi.home_team_id
        LEFT JOIN match_list ml
        ON ml.user_id = tl.user_id AND ml.match_id = mi.match_id
        WHERE tl.team_id IN (${teamId})
        AND ml.match_id IS NULL
        AND mi.match_id >= '${minDate}' 
  		AND mi.match_id <  '${maxDate}'

        UNION

        SELECT tl.user_id, mi.match_id, 1
        FROM match_info mi
        JOIN team_list tl
        ON tl.is_selected = 1 AND tl.team_id = mi.away_team_id
        LEFT JOIN match_list ml
        ON ml.user_id = tl.user_id AND ml.match_id = mi.match_id
        WHERE tl.team_id IN (${teamId})
        AND ml.match_id IS NULL
        AND mi.match_id >= '${minDate}' 
  		AND mi.match_id <  '${maxDate}'
`;
    }
};
