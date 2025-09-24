"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fcmSql = void 0;
exports.fcmSql = {
    patchFcmToken: "UPDATE user SET fcm_token = ? WHERE user_id = ?",
    get: `SELECT
        mi.match_id,
        t1.team_name as home_team_name,
        t2.team_name as away_team_name
    FROM
        match_info mi
    LEFT JOIN
        match_url mu ON mi.match_id = mu.match_id
    LEFT JOIN
        team t1 ON mi.home_team_id = t1.team_id
    LEFT JOIN
        team t2 ON mi.away_team_id = t2.team_id
    WHERE
        mi.match_id = ?
    AND
        mu.platform_id = 1
    AND
        mu.type = "highlight"
    `,
    getFcmToken: `SELECT
        u.fcm_token
    FROM
        user u
    LEFT JOIN
        match_list ml on u.user_id = ml.user_id
    WHERE
        ml.match_id = ?
    AND
        ml.is_selected = 1
        `
};
