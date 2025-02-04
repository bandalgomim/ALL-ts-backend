export const mainSql = {
    get:
    `WITH
        favorite as ( // 팀 리스트와 리스트 내의 팀 정보를 join
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
        calendar_match as ( //달력과 매치 정보를 join
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
    SELECT //모든 정보를 하나의 테이블로 join
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
    deleteMatch: "DELETE FROM calendar WHERE user_id = ? AND match_id = ?" // 유저 아이디와 매치정보를 통해 해당 매치를 삭제
};
