export const patchInfoUpdateSql = {
    patchLeague: `INSERT INTO league (league_id, league_name, league_initial, league_logo, sport_id, country_id) VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    league_name = IFNULL(VALUES(league_name), league_name),
                    league_initial = IFNULL(VALUES(league_initial), league_initial),
                    league_logo = IFNULL(VALUES(league_logo), league_logo),
                    sport_id = IFNULL(VALUES(sport_id), sport_id),
                    country_id = IFNULL(VALUES(country_id), country_id);`,
    patchSeasonState: "UPDATE season SET season_state = 0 WHERE league_id = ?;",
    patchSeason: `INSERT INTO season (season_id, league_id, season_name, season_start, season_end, season_state)
                VALUES (?, ?, ?, CAST(LEFT(?, 10) AS DATE), CAST(LEFT(?, 10) AS DATE), 1)
                ON DUPLICATE KEY UPDATE
                    season_name = IFNULL(VALUES(season_name), season_name),
                    season_start = IFNULL(VALUES(season_start), season_start),
                    season_end = IFNULL(VALUES(season_end), season_end),
                    season_state = 1;`,
    patchTeamBatch: `INSERT INTO team (team_id, team_name, team_initial, team_logo, sport_id, country_id) VALUES ?
                    ON DUPLICATE KEY UPDATE
                        team_name = VALUES(team_name),
                        team_initial = VALUES(team_initial),
                        team_logo = VALUES(team_logo),
                        sport_id = VALUES(sport_id),
                        country_id = VALUES(country_id);`
};
