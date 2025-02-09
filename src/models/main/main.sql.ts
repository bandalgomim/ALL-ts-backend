export const mainSql = {
    get:
    `WITH
        league_info as ( // 팀 리스트와 리스트 내의 팀 정보를 join
            SELECT 
                tl.team_id,
                t.team_name,
                t.team_logo
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
                t1.team_logo as home_team_logo,
                t2.team_logo as away_team_logo
            FROM
                calendar c
            INNER JOIN
                match_info m on c.match_id = m.match_id
            INNER JOIN
                team t1 on t1.team_id = m.home_team_id
            INNER JOIN
                team t2 on t2.team_id = m.away_team_id
            WHERE
                c.user_id = ?
        )
    SELECT //모든 정보를 하나의 테이블로 join
        f.team_id,
        f.team_name, 
        f.team_logo,
        cm.match_id,
        cm.match_date,
        cm.home_team_id,
        cm.away_team_id,
        cm.home_team_logo,
        cm.away_team_logo
    FROM 
        favorite f
    INNER JOIN 
        calendar_match cm 
    ON 
        f.team_id = cm.home_team_id OR f.team_id = cm.away_team_id;
    `,
    deleteMatch: "INSERT INTO calendar (user_id, match_id) VALUES (?, ?)" // 유저 아이디와 매치정보를 캘린더에 입력
};
