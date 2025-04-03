"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSelectedSql = void 0;
exports.isSelectedSql = {
    patchTeam: `INSERT INTO team_list (user_id, team_id, is_selected)
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE
    is_selected = CASE WHEN is_selected = 0 THEN 1 ELSE 0 END;
`,
    patchMatch: `INSERT INTO 
        match_list (user_id, match_id, is_selected) 
    VALUES 
        (?, ?, 1) 
    ON DUPLICATE KEY UPDATE 
        is_selected = CASE WHEN is_selected = 0 THEN 1 ELSE 0 END;`,
    patchLeague: `INSERT INTO 
        league_list (user_id, league_id, is_selected) 
    VALUES 
        (?, ?, 1) 
    ON DUPLICATE KEY UPDATE 
        is_selected = CASE WHEN is_selected = 0 THEN 1 ELSE 0 END;`
};
