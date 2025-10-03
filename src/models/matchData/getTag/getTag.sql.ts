export const getTagSql = {
    getTeamTag:
    `
    SELECT 
        team_id,
        league_id,
        team_name as team_tag
    FROM 
        team
    UNION ALL
    SELECT
        team_id,
        league_id,
        tag as team_tag
    FROM
        team_tag
    `,
    getLeagueTag:
    `
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
    FROM
        league_tag
    JOIN
        league l ON lt.league_id = l.league_id
    `,
    getPlatformTag:
    `
    SELECT 
        platform_id,
        platform_name as platform_tag
    FROM 
        platform
    `
};
