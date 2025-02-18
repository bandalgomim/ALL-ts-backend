export const matchSql = {
    get:
    `WITH match_info AS (
        SELECT 
            m.match_id,
            m.home_team_id,
            m.away_team_id,
            m.match_date,
            m.match_state,
            t1.team_logo AS home_team_logo,
            t2.team_logo AS away_team_logo,
            m.home_team_score,
            m.away_team_score,
            EXISTS (
                SELECT 1
                FROM match_list c
                WHERE m.match_id = c.match_id
                AND c.is_selected = true
            ) AS is_match_selected
        FROM match_info m
        LEFT JOIN team t1 ON t1.team_id = m.home_team_id
        LEFT JOIN team t2 ON t2.team_id = m.away_team_id
        WHERE m.match_id = ?
    ),
    platform_info AS (
        SELECT
            m.match_id,
            m.platform_id,
            m.url AS platform_url,
            p.platform_name,
            p.platform_logo
        FROM 
            match_url m
        LEFT JOIN
            platform p ON p.platform_id = m.platform_id
        WHERE m.match_id =?
    )
    SELECT
        mi.*,
        pi.*
    FROM
        match_info mi
    LEFT JOIN
        platform_info pi on mi.match_id = pi.match_id
    `
};
