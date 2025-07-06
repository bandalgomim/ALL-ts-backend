"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamSql = void 0;
exports.teamSql = {
    get: `WITH team_info AS (
        SELECT 
            t.team_id,
            t.team_name,
            i.icon as team_logo,
            t.\`rank\`,
            t.win,
            t.draw,
            t.rose,
            t.point,
            t.section,
            l.league_id,
            l.league_name,
            s.sport_id,
            s.sport_name,
            c.country_id,
            c.country_name,
            EXISTS (
                SELECT tl.is_selected 
                FROM team_list tl 
                WHERE tl.team_id = t.team_id AND tl.is_selected = 1 AND tl.user_id = ?
            ) AS is_team_selected
        FROM 
            team t
        LEFT JOIN
            icon i ON i.type = 'team' and t.team_id = i.id and i.user_id = ?
        LEFT JOIN
            league l ON t.league_id = l.league_id
        LEFT JOIN
            sport s ON t.sport_id = s.sport_id
        LEFT JOIN
            country c ON t.country_id = c.country_id
        WHERE 
            t.team_id = ?
    ),
    match_list AS (
        SELECT 
            m.match_id,
            m.home_team_id,
            m.away_team_id,
            t1.team_name AS home_team_name,
            t2.team_name AS away_team_name,
            t1.team_initial AS home_team_initial,
            t2.team_initial AS away_team_initial,
            m.match_date,
            TIME(m.match_date) AS match_time,
            m.match_state,
            i1.icon AS home_team_logo,
            i2.icon AS away_team_logo,
            m.home_team_score,
            m.away_team_score,
            EXISTS (
                SELECT 1
                FROM match_list c
                WHERE m.match_id = c.match_id
                AND c.is_selected = true
                AND c.user_id = ?
            ) AS is_match_selected
        FROM
            match_info m
        LEFT JOIN
            team t1 ON t1.team_id = m.home_team_id
        LEFT JOIN
            team t2 ON t2.team_id = m.away_team_id
        LEFT JOIN
            icon i1 ON i1.type = 'team' and m.home_team_id = i1.id and i1.user_id = ?
        LEFT JOIN
            icon i2 ON i2.type = 'team' and m.away_team_id = i2.id and i2.user_id = ?
    )
    SELECT 
        ti.*,
        ml.*
    FROM 
        team_info ti
    LEFT JOIN 
        match_list ml ON ml.home_team_id = ti.team_id OR ml.away_team_id = ti.team_id
    ORDER BY 
        ml.match_date;
    `
};
