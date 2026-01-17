"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translatorSql = void 0;
exports.translatorSql = {
    post: (data) => {
        return `INSERT INTO match_url (match_id, platform_id, type, url) 
        VALUES ${data}
    ON DUPLICATE KEY UPDATE
        platform_id = VALUES(platform_id),
        url = VALUES(url)`;
    },
    get: `
    (
        SELECT l.league_id, t.team_id, t.team_name, t.team_initial, tt.tag
        FROM league l
        JOIN season s ON l.league_id = s.league_id AND s.season_state = 1
        JOIN season_team_record str ON str.season_id = s.season_id
        JOIN team t ON t.team_id = str.team_id
        jOIN team_tag tt ON t.team_id = tt.team_id
        LEFT JOIN league_tag lt ON l.league_id = lt.league_id
        WHERE l.league_name = ?
    )
    UNION
    (
        SELECT l.league_id, t.team_id, t.team_name, t.team_initial, tt.tag
        FROM league l
        JOIN season s ON l.league_id = s.league_id AND s.season_state = 1
        JOIN season_team_record str ON str.season_id = s.season_id
        JOIN team t ON t.team_id = str.team_id
        jOIN team_tag tt ON t.team_id = tt.team_id
        LEFT JOIN league_tag lt ON l.league_id = lt.league_id
        WHERE l.league_initial = ?
    )
    UNION
    (
        SELECT l.league_id, t.team_id, t.team_name, t.team_initial, tt.tag
        FROM league l
        JOIN season s ON l.league_id = s.league_id AND s.season_state = 1
        JOIN season_team_record str ON str.season_id = s.season_id
        JOIN team t ON t.team_id = str.team_id
        jOIN team_tag tt ON t.team_id = tt.team_id
        JOIN league_tag lt ON l.league_id = lt.league_id
        WHERE lt.tag = ?
    );
    `
};
