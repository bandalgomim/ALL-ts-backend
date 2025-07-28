export const schedulerSql = {
    get:
    `SELECT
        m.league_id,
        l.league_name,
        m.match_date
    FROM
        match_info m
    JOIN
        league l ON m.league_id = l.league_id
    WHERE
        DATE(m.match_date) = ?
    ORDER BY
        m.league_id ASC, m.match_date ASC;`
};
