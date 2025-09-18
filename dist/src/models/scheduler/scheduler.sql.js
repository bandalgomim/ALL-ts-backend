"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulerSql = void 0;
exports.schedulerSql = {
    get: `SELECT
        m.league_id,
        l.league_name,
        m.match_date
    FROM
        match_info m
    JOIN
        league l ON m.league_id = l.league_id
    WHERE
        DATE(m.match_date) = ?
    ORDER BY
        m.league_id ASC, m.match_date ASC;`,
    post: (data) => {
        return `INSERT INTO match_info (match_id, league_id, home_team_id, away_team_id, match_date, match_state, home_team_score, away_team_score, double_header) 
        VALUES ${data}
    ON DUPLICATE KEY UPDATE
        league_id = VALUES(league_id),
        home_team_id = VALUES(home_team_id),
        away_team_id = VALUES(away_team_id),
        match_date = VALUES(match_date),
        match_state = VALUES(match_state),
        home_team_score = VALUES(home_team_score),
        away_team_score = VALUES(away_team_score),
        double_header = VALUES(double_header);`;
    }
};
