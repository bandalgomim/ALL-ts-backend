"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchIdSql = void 0;
exports.getMatchIdSql = {
    get: `
    SELECT
        match_id
    FROM
        match_info
    WHERE
        double_header = ?
        AND SUBSTRING_INDEX(SUBSTRING_INDEX(match_id, '-', 4), '-', -1) = ?
        AND SUBSTRING_INDEX(SUBSTRING_INDEX(match_id, '-', 5), '-', -1) = ?
    ORDER BY
        ABS(DATEDIFF(match_date, ?)),   -- 날짜 차이 (일 단위)
        DATEDIFF(match_date, ?) ASC     -- 동일하면 과거(음수)가 먼저
    LIMIT 1;
    `
};
