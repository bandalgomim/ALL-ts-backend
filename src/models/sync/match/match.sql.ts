export const matchSql = {
  get: `SELECT
        m.league_id,
        m.season_id,
        m.match_date
    FROM
        match_info m
    WHERE
        DATE(m.match_date) = ?
    ORDER BY 
        m.league_id ASC, m.match_date ASC;`,
  patch: `
    INSERT INTO match_info (
      match_id,
      league_id,
      home_team_id,
      away_team_id,
      match_date,
      match_state,
      home_team_score,
      away_team_score,
      double_header,
      season_id
    )
    VALUES ?
    ON DUPLICATE KEY UPDATE
      league_id = VALUES(league_id),
      home_team_id = VALUES(home_team_id),
      away_team_id = VALUES(away_team_id),
      match_date = VALUES(match_date),
      match_state = VALUES(match_state),
      home_team_score = VALUES(home_team_score),
      away_team_score = VALUES(away_team_score),
      double_header = VALUES(double_header),
      season_id = VALUES(season_id);
    `,
  patchMatchList: {
    createTmpNewMatches: `
            CREATE TEMPORARY TABLE IF NOT EXISTS tmp_new_matches (
            match_id VARCHAR(30) NOT NULL,
            home_team_id VARCHAR(255) NOT NULL,
            away_team_id VARCHAR(255) NOT NULL,
            PRIMARY KEY (match_id)
            ) ENGINE=MEMORY;
        `,

    truncateTmpNewMatches: `
            TRUNCATE TABLE tmp_new_matches;
        `,

    insertTmpNewMatches: `
            INSERT INTO tmp_new_matches (match_id, home_team_id, away_team_id)
            VALUES ?;
        `,

    insertMatchListFromTmp: `
            INSERT IGNORE INTO match_list (user_id, match_id, is_selected)
            SELECT DISTINCT tl.user_id, tnm.match_id, 1
            FROM tmp_new_matches tnm
            JOIN team_list tl
            ON tl.is_selected = 1
            AND tl.team_id IN (tnm.home_team_id, tnm.away_team_id);
        `
  }
};
