export const getMatchIdSql = {
    get:
    `
    SELECT
        match_id
    FROM
        match_info
    WHERE
        double_header = ?
        AND SUBSTRING_INDEX(SUBSTRING_INDEX(match_id, '-', 4), '-', -1) = ?
        AND SUBSTRING_INDEX(SUBSTRING_INDEX(match_id, '-', 5), '-', -1) = ?
    ORDER BY
        ABS(TIMESTAMPDIFF(SECOND, match_date, ?))
    LIMIT 1`
};
