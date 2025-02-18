export const mainSql = {
    get:
    `WITH
        team_list_info as (
            SELECT 
                tl.team_id,
                t.team_name,
                t.team_logo,
                tl.is_selected AS is_team_selected,
                null AS match_id,
                null AS home_team_id,
                null AS away_team_id,
                null AS match_date,
                null AS match_state,
                null AS home_team_logo,
                null AS away_team_logo,
                null AS home_team_score,
                null AS away_team_score,
                null AS is_match_selected
            FROM 
                team_list tl
            LEFT JOIN
                team t ON tl.team_id = t.team_id
            WHERE 
                tl.user_id = ?
        ),
        match_list_info as (
            SELECT
                null AS team_id,
                null AS team_name,
                null AS team_logo,
                null AS is_selected, 
                m.match_id,
                m.home_team_id,
                m.away_team_id,
                m.match_date,
                m.match_state,
                t1.team_logo as home_team_logo,
                t2.team_logo as away_team_logo,
                m.home_team_score,
                m.away_team_score,
                EXISTS (
                    SELECT 1
                    FROM match_list c
                    WHERE m.match_id = c.match_id
                    AND c.is_selected = true
                ) AS is_match_selected
            FROM
                match_list c
            LEFT JOIN
                match_info m on c.match_id = m.match_id
            LEFT JOIN
                team t1 on t1.team_id = m.home_team_id
            LEFT JOIN
                team t2 on t2.team_id = m.away_team_id
            WHERE
                c.user_id = ?
        )
    SELECT 
        tli.*
    FROM 
        team_list_info tli 
    UNION ALL
    SELECT
        mli.*
    FROM match_list_info mli
    `
};
