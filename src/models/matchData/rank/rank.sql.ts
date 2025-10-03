// src/models/matchData/rank/rank.sql.ts

export const rankSql = {

    update: (data: string) => {
        return `INSERT INTO season_team_record (season_id, league_id, team_id, win, draw, lose, point, \`rank\`, \`section\`) 
        VALUES ${data}
    ON DUPLICATE KEY UPDATE
        season_id = VALUES(season_id),
        league_id = VALUES(league_id),
        team_id = VALUES(team_id),
        win = VALUES(win),
        draw = VALUES(draw),
        lose = VALUES(lose),
        point = VALUES(point),
        \`rank\` = VALUES(\`rank\`),
        \`section\` = VALUES(\`section\`);`;
    }
};

