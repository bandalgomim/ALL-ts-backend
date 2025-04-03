export const matchSql = {
    get:
    `WITH match_info_cte AS (
        SELECT 
            m.match_id,
            m.home_team_id,
            m.away_team_id,
            t1.team_name AS home_team_name,
            t2.team_name AS away_team_name,
            m.match_date,
            m.match_state,
            t1.team_logo AS home_team_logo,
            t2.team_logo AS away_team_logo,
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
        ORDER BY m.match_date ASC
    ),
    platform_info AS (
        SELECT
            lp.league_id,
            lp.platform_id,
            lp.url AS platform_url,
            p.platform_name,
            p.platform_logo
        FROM 
            league_platform lp
        LEFT JOIN
            platform p ON p.platform_id = lp.platform_id
    )
    SELECT
        mi.*,
        pi.platform_id,
        pi.platform_url,
        pi.platform_name,
        pi.platform_logo
    FROM
        match_info_cte mi
    LEFT JOIN
        platform_info pi on mi.home_league_id = pi.league_id

    UNION

    SELECT
        mi.*,
        pi.platform_id,
        pi.platform_url,
        pi.platform_name,
        pi.platform_logo
    FROM
        match_info_cte mi
    LEFT JOIN
        platform_info pi on mi.away_league_id = pi.league_id
    `
};
