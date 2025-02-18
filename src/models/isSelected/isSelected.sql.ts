
export const isSelectedSql = {
    patchTeam:
    `INSERT INTO 
        team_list (user_id, team_id, is_selected) 
    VALUES 
        (?, ?, 1) 
    ON DUPLICATE KEY UPDATE 
        is_selected = CASE WHEN is_selected = 0 THEN 1 ELSE 0 END`,
    updateMatch:
    `WITH match_team_list AS (
        SELECT
            m.match_id,
            m.home_team_id,
            m.away_team_id,
            tl1.is_selected AS home_team_is_selected,
            tl2.is_selected AS away_team_is_selected
        FROM
            match_info m
        LEFT JOIN
            team_list tl1 ON tl1.team_id = m.home_team_id
        LEFT JOIN
            team_list tl2 ON tl2.team_id = m.away_team_id
        WHERE
            m.home_team_id = ? or m.away_team_id = ?
    )
    UPDATE 
        match_list ml
    LEFT JOIN 
        match_team_list mtl on ml.match_id = mtl.match_id
    SET
        ml.is_selected = CASE
            WHEN COALESCE(mtl.home_team_is_selected, 0) = 1 OR COALESCE(mtl.away_team_is_selected, 0) = 1 THEN 1
            ELSE 0
        END
    WHERE user_id = ?
    `,

    patchMatch:
    `INSERT INTO 
        match_list (user_id, match_id, is_selected) 
    VALUES 
        (?, ?, 1) 
    ON DUPLICATE KEY UPDATE 
        is_selected = CASE WHEN is_selected = 0 THEN 1 ELSE 0 END;`
};

