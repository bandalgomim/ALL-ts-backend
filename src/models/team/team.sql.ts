export const teamSql = {
  get: `WITH
	selected_league AS (
		SELECT
			t.team_id,
			COALESCE(
				MIN(CASE WHEN l.league_type='domestic' THEN l.league_id END),
				MIN(CASE WHEN l.league_type='international' THEN l.league_id END)
			) AS league_id
		FROM 
			team t
		JOIN
			season_team_record str
			ON str.team_id = t.team_id
		JOIN
			league l
			ON l.league_id = str.league_id
		WHERE 
			t.team_id = ?
		GROUP BY t.team_id
	),
	/* 팀 정보(선호 리그 기준) */
	team_info AS (
		SELECT
			t.team_id,
			t.team_name,
			t.team_initial,
			COALESCE(i.icon, t.team_logo) AS team_logo,
			str.\`rank\`,
			str.win,
			str.draw,
			str.lose,
			str.point,
			str.section,
			l.league_id,
			l.league_name,
			s.sport_id,
			s.sport_name,
			c.country_id,
			c.country_name,
			EXISTS (
				SELECT 1
				FROM team_list tl
				WHERE tl.team_id = t.team_id
					AND tl.is_selected = 1
					AND tl.user_id = ?
			) AS is_team_selected
		FROM team t
		LEFT JOIN icon i
			ON i.type='team' AND i.id=t.team_id AND i.user_id=?
		LEFT JOIN 
			selected_league sl 
			ON sl.team_id = t.team_id
		LEFT JOIN
			league l
			ON l.league_id = sl.league_id 
		LEFT JOIN
			season se
			on se.league_id = l.league_id AND se.season_state = 1
		LEFT JOIN
			season_team_record str
			ON str.team_id=t.team_id AND str.league_id=l.league_id AND str.season_id=se.season_id
		LEFT JOIN sport s 
			ON s.sport_id = t.sport_id
		LEFT JOIN country c 
			ON c.country_id = t.country_id
		WHERE t.team_id = ?
	),
	/* 이 팀이 홈/원정으로 뛴 모든 경기: 날짜 제한 없음, ml.* 유지 */
	match_row AS (
		/* home */
		SELECT 
			m.match_id,
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
				SELECT 1 FROM match_list c
				WHERE c.match_id     = m.match_id
					AND c.is_selected = TRUE
					AND c.user_id         = ?
			) AS is_match_selected
		FROM match_info m
		LEFT JOIN team t1 ON t1.team_id = m.home_team_id
		LEFT JOIN team t2 ON t2.team_id = m.away_team_id
		LEFT JOIN icon i1 ON i1.type='team' AND i1.id=m.home_team_id AND i1.user_id=?
		LEFT JOIN icon i2 ON i2.type='team' AND i2.id=m.away_team_id AND i2.user_id=?
		WHERE m.home_team_id = ?

		UNION ALL

		/* away */
		SELECT 
			m.match_id,
			m.home_team_id,
			m.away_team_id,
			t1.team_name             AS home_team_name,
			t2.team_name             AS away_team_name,
			t1.team_initial        AS home_team_initial,
			t2.team_initial        AS away_team_initial,
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
				SELECT 1 FROM match_list c
				WHERE c.match_id     = m.match_id
					AND c.is_selected = TRUE
					AND c.user_id         = ?
			) AS is_match_selected
		FROM match_info m
		LEFT JOIN team t1 ON t1.team_id = m.home_team_id
		LEFT JOIN team t2 ON t2.team_id = m.away_team_id
		LEFT JOIN icon i1 ON i1.type='team' AND i1.id=m.home_team_id AND i1.user_id=?
		LEFT JOIN icon i2 ON i2.type='team' AND i2.id=m.away_team_id AND i2.user_id=?
		WHERE m.away_team_id = ?
	)
	SELECT
		ti.*,
		mr.*
	FROM team_info ti
	LEFT JOIN match_row mr ON 1 = 1

	ORDER BY mr.match_date;`
};
