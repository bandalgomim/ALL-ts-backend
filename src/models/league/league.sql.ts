export const leagueSql = {
    get:
    `WITH match_list AS (
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
            ) AS is_match_selected,
            NULL AS team_id,
            NULL AS team_name,
            NULL AS team_logo
        FROM match_info m
        LEFT JOIN team t1 ON t1.team_id = m.home_team_id
        LEFT JOIN team t2 ON t2.team_id = m.away_team_id
        WHERE m.league_id = ?
    ),
    team_list AS (
        SELECT 
            NULL AS match_id,
            NULL AS home_team_id,
            NULL AS away_team_id,
            NULL AS match_date,
            NULL AS match_state,
            NULL AS home_team_logo,
            NULL AS away_team_logo,
            NULL AS home_team_score,
            NULL AS away_team_score,
            NULL AS is_match_selected,
            t.team_id,
            t.team_name,
            t.team_logo
        FROM team t
        WHERE t.league_id = ?
    ),
    team_match AS (
        SELECT * FROM team_list
        UNION ALL
        SELECT * FROM match_list
    ),
    league_info AS (
        SELECT
            l.league_id,
            l.league_name,
            l.sport_id,
            s.sport_name,
            l.country_id,
            c.country_name
        FROM 
            league l
        LEFT JOIN
            sport s ON l.sport_id = s.sport_id
        LEFT JOIN
            country c ON l.country_id = c.country_id
        WHERE
            l.league_id = ?
    )
    SELECT *
    FROM league_info
    CROSS JOIN team_match;`
};
