"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchSql = void 0;
exports.matchSql = {
    get: `WITH match_teams AS (
        SELECT m.home_team_id AS team_id FROM match_info m WHERE m.match_id = ?
        UNION ALL
        SELECT m.away_team_id FROM match_info m WHERE m.match_id = ?
    ),
    preferred_league AS (
        /* 팀별 1행: regular 우선 → 없으면 cup, 각 타입에서 최소 league_id 선택 */
        SELECT
        a.team_id,
        COALESCE(
            MIN(CASE WHEN l.league_type = 'regular' THEN l.league_id END),
            MIN(CASE WHEN l.league_type = 'cup'     THEN l.league_id END)
        ) AS league_id
        FROM affiliation a
        JOIN league      l  ON l.league_id = a.league_id
        JOIN match_teams mt ON mt.team_id  = a.team_id
        GROUP BY a.team_id
    ),
    match_info_cte AS (
        SELECT
            m.match_id,
            m.league_id,                 -- 원본 match_info의 league_id
            m.home_team_id,
            m.away_team_id,
    
            t1.team_name    AS home_team_name,
            t2.team_name    AS away_team_name,
            t1.team_initial AS home_team_initial,
            t2.team_initial AS away_team_initial,
    
            m.match_date,
            m.match_time,
            m.match_state,
    
            i1.icon AS home_team_logo,
            i2.icon AS away_team_logo,
    
            m.home_team_score,
            m.away_team_score,
    
            s.sport_name,
    
            c1.country_name AS home_country_name,
            c2.country_name AS away_country_name,
    
            pl1.league_id   AS home_league_id,
            pl2.league_id   AS away_league_id,
            lh.league_name  AS home_league_name,
            la.league_name  AS away_league_name,
    
            EXISTS (
            SELECT 1
            FROM match_list c
            WHERE c.match_id   = m.match_id
                AND c.is_selected = TRUE
            ) AS is_match_selected
    
        FROM match_info m
    
        LEFT JOIN icon i1
        ON i1.type = 'team'
        AND i1.id   = m.home_team_id
        AND i1.user_id = ?
    
        LEFT JOIN icon i2
        ON i2.type = 'team'
        AND i2.id   = m.away_team_id
        AND i2.user_id = ?
    
        LEFT JOIN team    t1 ON t1.team_id = m.home_team_id
        LEFT JOIN team    t2 ON t2.team_id = m.away_team_id
        LEFT JOIN country c1 ON c1.country_id = t1.country_id
        LEFT JOIN country c2 ON c2.country_id = t2.country_id
        LEFT JOIN sport    s ON s.sport_id    = t1.sport_id
    
        /* 팀별 선택된 리그 id만 조인 (이 시점엔 이름 없음) */
        LEFT JOIN preferred_league pl1 ON pl1.team_id = t1.team_id
        LEFT JOIN preferred_league pl2 ON pl2.team_id = t2.team_id
    
        /* 여기서 리그 이름을 붙임 */
        LEFT JOIN league lh ON lh.league_id = pl1.league_id
        LEFT JOIN league la ON la.league_id = pl2.league_id
    
        WHERE m.match_id = ?
    )
    
    SELECT
        mi.*,
        lp.platform_id,
        lp.url  AS league_url,
        mp.url  AS match_url,
        mp.type AS match_url_type,
        p.platform_name
    FROM match_info_cte mi
    LEFT JOIN league_platform lp
        ON mi.league_id = lp.league_id
    LEFT JOIN match_url mp
        ON mi.match_id   = mp.match_id
    AND lp.platform_id = mp.platform_id
    LEFT JOIN platform p
        ON p.platform_id = lp.platform_id
    ORDER BY mi.match_time ASC
    `
};
