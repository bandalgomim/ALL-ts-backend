export const teamSql = {
  patch: `INSERT INTO team (team_id, team_name, team_initial, team_logo, sport_id, country_id) VALUES ?
                    ON DUPLICATE KEY UPDATE
                        team_name = VALUES(team_name),
                        team_initial = VALUES(team_initial),
                        team_logo = VALUES(team_logo),
                        sport_id = VALUES(sport_id),
                        country_id = VALUES(country_id);`
};
