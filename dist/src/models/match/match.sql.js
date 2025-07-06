"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchSql = void 0;
exports.matchSql = {
    get: `WITH match_info_cte AS (
        SELECT 
            m.match_id,
            m.league_id,
            m.home_team_id,
            m.away_team_id,
            t1.team_name AS home_team_name,
            t2.team_name AS away_team_name,
            t1.team_initial AS home_team_initial,
            t2.team_initial AS away_team_initial,
            m.match_date,
            m.match_state,
            i1.icon AS home_team_logo,
            i2.icon AS away_team_logo,
            m.home_team_score,
            m.away_team_score,
            s.sport_name,
            c1.country_name as home_country_name,
            c2.country_name as away_country_name,
            l1.league_id as home_league_id,
            l2.league_id as away_league_id,
            l1.league_name as home_league_name,
            l2.league_name as away_league_name,
            EXISTS (
                SELECT 1
                FROM match_list c
                WHERE m.match_id = c.match_id
                AND c.is_selected = true
            ) AS is_match_selected
        FROM 
            match_info m
        LEFT JOIN
            icon i1 ON i1.type = 'team' and m.home_team_id = i1.id and i1.user_id = ?
        LEFT JOIN
            icon i2 ON i2.type = 'team' and m.away_team_id = i2.id and i2.user_id = ?
        LEFT JOIN 
            team t1 ON t1.team_id = m.home_team_id
        LEFT JOIN 
            team t2 ON t2.team_id = m.away_team_id
        LEFT JOIN 
            country c1 ON t1.country_id = c1.country_id
        LEFT JOIN 
            country c2 ON t2.country_id = c2.country_id
        LEFT JOIN
            sport s ON t1.sport_id = s.sport_id
        LEFT JOIN 
            league l1 ON t1.league_id = l1.league_id
        LEFT JOIN 
            league l2 ON t2.league_id = l2.league_id
        WHERE m.match_id = ?
    )
    SELECT
        mi.*,
        lp.platform_id,
        lp.url AS league_url,
        mp.url as match_url,
        mp.type as match_url_type,
        p.platform_name,
        p.platform_logo
    FROM
        match_info_cte mi
    LEFT JOIN
        league_platform lp on mi.league_id = lp.league_id
    LEFT JOIN
        match_url mp on mi.match_id = mp.match_id and lp.platform_id = mp.platform_id
    LEFT JOIN
        platform p ON p.platform_id = lp.platform_id
    ORDER BY mi.match_date ASC
    `
};
