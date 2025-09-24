"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTagSql = void 0;
exports.searchTagSql = {
    patch: `WITH
        search_tag_team AS (
            SELECT 
                t.team_id AS teamId,
                CAST(NULL AS SIGNED) AS leagueId,
                t.team_name AS tag,
                t.team_name AS itemName
            FROM team t
        ),
        search_tag_league AS (
            SELECT 
                CAST(NULL AS SIGNED) AS teamId,
                l.league_id AS leagueId,
                l.league_name AS tag,
                l.league_name AS itemName
            FROM league l
        ),
        search_tag_team_tag AS (
            SELECT
                tt.team_id AS teamId,
                CAST(NULL AS SIGNED) AS leagueId,
                tt.tag AS tag,
                t.team_name AS itemName
            FROM team_tag tt
            JOIN team t ON tt.team_id = t.team_id
        ),
        search_tag_league_tag AS (
            SELECT
                CAST(NULL AS SIGNED) AS teamId,
                lt.league_id AS leagueId,
                lt.tag AS tag,
                l.league_name AS itemName
            FROM league_tag lt
            JOIN league l ON lt.league_id = l.league_id
        )
        SELECT * FROM search_tag_team
        UNION ALL
        SELECT * FROM search_tag_league
        UNION ALL
        SELECT * FROM search_tag_team_tag
        UNION ALL
        SELECT * FROM search_tag_league_tag;
    `
};
