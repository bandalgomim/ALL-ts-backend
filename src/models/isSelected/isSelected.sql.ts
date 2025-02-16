const getPatchQuery = (table: string) => `
    INSERT INTO 
        ${table} (user_id, ${table === "team_list" ? "team_id" : "match_id"}, is_selected) 
    VALUES 
        (?, ?, 1) 
    ON DUPLICATE KEY UPDATE 
        is_selected = CASE WHEN is_selected = 0 THEN 1 ELSE 0 END;
`;

export const isSelectedSql = {
    patchTeam: getPatchQuery("team_list"),
    patchMatch: getPatchQuery("match_list")
};

