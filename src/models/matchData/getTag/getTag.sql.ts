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
        league_name as league_tag
    FROM 
        league
    UNION
    SELECT
        league_id,
        tag as league_tag
    FROM
        league_tag
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
