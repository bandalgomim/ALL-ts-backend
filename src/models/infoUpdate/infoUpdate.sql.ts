export const patchInfoUpdateSql = {
    patchLeague: `UPDATE league 
                SET league_logo = ?
                WHERE league_id = ?;`,
    patchSeason: `INSERT INTO season (season_id, league_id, season_name)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    season_name = VALUES(season_name);`,
    patchTeam: `INSERT INTO team (team_id, team_name, team_initial, team_logo, sport_id, country_id) VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    team_name = VALUES(team_name),
                    team_initial = VALUES(team_initial),
                    team_logo = VALUES(team_logo)`
};
