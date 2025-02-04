export const mainSql = {
    get:
    `WITH
        favorite as (
            SELECT 
                tl.team_id,
                t.name as team_name,
                t.icon as team_icon
            FROM 
                team_list tl
            INNER JOIN
                team t ON tl.team_id = t.team_id
            WHERE 
                tl.user_id = ?
        ),
        calendar_match as (
            SELECT 
                m.match_id,
                m.home_team_id,
                m.away_team_id,
                m.match_date,
            FROM
                calendar c
            INNER JOIN
                match_info m on c.match_id = m.match_id
            WHERE
                c.user_id = ?
        )
    SELECT 
        f.team_id AS team_id,
        f.team_name AS team_name, 
        f.team_icon AS team_icon,
        cm.match_id,
        cm.match_date,
        cm.home_team_id,
        cm.away_team_id,
    FROM 
        favorite f
    INNER JOIN 
        calendar_match cm 
    ON 
        f.team_id = cm.home_team_id OR f.team_id = cm.away_team_id;
    `,
    deleteMatch: "DELETE FROM calendar WHERE user_id = ? AND match_id = ?"
};
