"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainSql = void 0;
exports.mainSql = {
    get: `WITH
        team_list_info as (
            SELECT 
                tl.team_id,
                t.team_name,
                t.team_initial,
                COALESCE(i.icon, t.team_logo) as team_logo,
                tl.\`index\` AS team_index,
                null AS league_id,
                null AS league_name,
                null AS league_initial,
                null AS league_logo,
                null AS league_index,
                null AS user_id,
                null AS match_id,
                null AS home_team_id,
                null AS away_team_id,
                NULL AS home_team_name,
                NULL AS away_team_name,
                NULL AS home_team_initial,
                NULL AS away_team_initial,
                null AS match_date,
                null AS match_state,
                null AS home_team_logo,
                null AS away_team_logo,
                null AS home_team_score,
                null AS away_team_score,
                null AS is_match_selected
            FROM 
                team_list tl
            LEFT JOIN
                icon i ON i.type = 'team' and tl.team_id = i.id and i.user_id = ?
            LEFT JOIN
                team t ON tl.team_id = t.team_id
            WHERE
                tl.is_selected = 1
            AND
                tl.user_id = ?
        ),
        league_list_info as (
            SELECT 
                null AS team_id,
                null AS team_name,
                null AS team_initial,
                null AS team_logo,
                null AS team_index,
                ll.league_id,
                l.league_name,
                l.league_initial,
                COALESCE(i.icon, l.league_logo) as league_logo,
                ll.\`index\` AS league_index,
                null AS user_id,
                null AS match_id,
                null AS home_team_id,
                null AS away_team_id,
                NULL AS home_team_name,
                NULL AS away_team_name,
                NULL AS home_team_initial,
                NULL AS away_team_initial,
                null AS match_date,
                null AS match_state,
                null AS home_team_logo,
                null AS away_team_logo,
                null AS home_team_score,
                null AS away_team_score,
                null AS is_match_selected
            FROM 
                league_list ll
            LEFT JOIN
                icon i ON i.type = 'league' and ll.league_id = i.id and i.user_id = ?
            LEFT JOIN
                league l ON ll.league_id = l.league_id
            WHERE
                ll.is_selected = 1
            AND
                ll.user_id = ?
        ),
        match_list_info as (
            SELECT
                null AS team_id,
                null AS team_name,
                null AS team_initial,
                null AS team_logo,
                null AS team_index,
                null AS league_id,
                null AS league_name,
                null AS league_initial,
                null AS league_logo,
                null AS league_index,
                c.user_id,
                c.match_id,
                m.home_team_id,
                m.away_team_id,
                t1.team_name AS home_team_name,
                t2.team_name AS away_team_name,
                t1.team_initial AS home_team_initial,
                t2.team_initial AS away_team_initial,
                DATE_FORMAT(
                    CONVERT_TZ(m.match_date, '+00:00', '+09:00'),
                    '%Y-%m-%d %H:%i:%s'
                    ) AS match_date,
                m.match_state,
                COALESCE(i1.icon, t1.team_logo) AS home_team_logo,
                COALESCE(i2.icon, t2.team_logo) AS away_team_logo,
                m.home_team_score,
                m.away_team_score,
                EXISTS (
                    SELECT 1
                    FROM match_list c
                    WHERE m.match_id = c.match_id
                    AND c.is_selected = true
                    AND c.user_id = ?
                ) AS is_match_selected
            FROM
                match_list c
            LEFT JOIN
                match_info m on c.match_id = m.match_id
            LEFT JOIN
                team t1 on t1.team_id = m.home_team_id
            LEFT JOIN
                team t2 on t2.team_id = m.away_team_id
            LEFT JOIN
                icon i1 ON i1.type = 'team' and m.home_team_id = i1.id and i1.user_id = ?
            LEFT JOIN
                icon i2 ON i2.type = 'team' and m.away_team_id = i2.id and i2.user_id = ?
            WHERE
                c.user_id = ?
            ORDER BY m.match_date ASC
        )
    SELECT 
        tli.*
    FROM 
        team_list_info tli 
    UNION ALL
    SELECT
        mli.*
    FROM 
        match_list_info mli
    UNION ALL
    SELECT
        lli.*
    FROM 
        league_list_info lli
    `,
    patchTeamList: (teamItems) => {
        const caseStatements = teamItems.map(() => "WHEN team_id = ? THEN ?").join(" ");
        const whereClause = teamItems.map(() => "?").join(", ");
        return `
            UPDATE team_list
            SET \`index\` = CASE ${caseStatements} END
            WHERE team_id IN (${whereClause});
        `;
    },
    patchLeagueList: (leagueItems) => {
        const caseStatements = leagueItems.map(() => "WHEN league_id = ? THEN ?").join(" ");
        const whereClause = leagueItems.map(() => "?").join(", ");
        return `
            UPDATE league_list
            SET \`index\` = CASE ${caseStatements} END
            WHERE league_id IN (${whereClause});
        `;
    }
};
