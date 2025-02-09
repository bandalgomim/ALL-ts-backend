export const teamSql = {
    get:
    `WITH team_info AS (
        SELECT 
            t.team_id,
            t.team_name,
            t.team_logo,
            l.league_id,
            l.league_name,
            s.sport_id,
            s.sport_name,
            c.country_id,
            c.country_name,
            EXISTS (
                SELECT 1 
                FROM team_list tl 
                WHERE tl.team_id = t.team_id
            ) AS is_team_selected
        FROM 
            team t
        INNER JOIN
            league l ON t.league_id = l.league_id
        INNER JOIN
            sport s ON t.sport_id = s.sport_id
        INNER JOIN
            country c ON t.country_id = c.country_id
        WHERE 
            t.team_id = ?
    ),
    match_list AS (
        SELECT 
            m.match_id,
            m.home_team_id,
            m.away_team_id,
            m.match_date,
            t1.team_logo AS home_team_logo,
            t2.team_logo AS away_team_logo,
            EXISTS (
                SELECT 1 
                FROM calendar c 
                WHERE m.match_id = c.match_id
            ) AS is_match_selected
        FROM
            match_info m
        INNER JOIN
            team t1 ON t1.team_id = m.home_team_id
        INNER JOIN
            team t2 ON t2.team_id = m.away_team_id
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
    `,
    patchMatch: "DELETE FROM calendar WHERE user_id = ? AND match_id = ?" // 유저 아이디와 매치정보를 통해 해당 매치를 삭제
};
