export const leagueSql = {
    get:
    `WITH match_list AS (
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
            t1.team_logo AS home_team_logo,
            t2.team_logo AS away_team_logo,
            m.home_team_score,
            m.away_team_score,
            EXISTS (
                SELECT 1
                FROM match_list c
                WHERE m.match_id = c.match_id
                AND c.is_selected = true
                AND c.user_id = ?
            ) AS is_match_selected,
            NULL AS team_id,
            NULL AS team_name,
            NULL AS team_initial,
            NULL AS team_logo,
            NULL AS win,
            NULL AS draw,
            NULL AS lose,
            NULL AS point,
            NULL AS section,
        FROM match_info m
        LEFT JOIN team t1 ON t1.team_id = m.home_team_id
        LEFT JOIN team t2 ON t2.team_id = m.away_team_id
        WHERE m.league_id = ?
        ORDER BY m.match_date ASC
    ),
    team_list AS (
        SELECT 
            NULL AS match_id,
            NULL AS home_team_id,
            NULL AS away_team_id,
            NULL AS home_team_name,
            NULL AS away_team_name,
            NULL AS home_team_initial,
            NULL AS away_team_initial,
            NULL AS match_date,
            null AS match_time,
            NULL AS match_state,
            NULL AS home_team_logo,
            NULL AS away_team_logo,
            NULL AS home_team_score,
            NULL AS away_team_score,
            NULL AS is_match_selected,
            t.team_id,
            t.team_name,
            t.team_initial,
            t.team_logo,
            t.win,
            t.draw,
            t.lose,
            t.point,
            t.section
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
            l.league_logo,
            l.sport_id,
            s.sport_name,
            l.country_id,
            c.country_name,
            EXISTS (
                SELECT ll.is_selected 
                FROM league_list ll 
                WHERE ll.league_id = l.league_id AND ll.is_selected = 1 AND ll.user_id = ?
            ) AS is_league_selected
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
    LEFT JOIN team_match ON 1 = 1`
};
