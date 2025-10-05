"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagSql = void 0;
exports.getTagSql = {
    getTeamTag: `
    SELECT 
        t.team_id,
        l.league_id,
        t.team_name as team_tag
    FROM 
        team t
    JOIN affiliation a ON t.team_id = a.team_id
    JOIN league l ON a.league_id = l.league_id
    UNION ALL
    SELECT
        team_id,
        league_id,
        tag as team_tag
    FROM
        team_tag
    `,
    getLeagueTag: `
    SELECT 
        league_id,
        season_id,
        league_name as league_tag
    FROM 
        league
    UNION
    SELECT
        lt.league_id,
        l.season_id,
        lt.tag as league_tag
    FROM league_tag lt 
    JOIN
        league l ON lt.league_id = l.league_id
    `,
    getPlatformTag: `
    SELECT 
        platform_id,
        platform_name as platform_tag
    FROM 
        platform
    `
};
