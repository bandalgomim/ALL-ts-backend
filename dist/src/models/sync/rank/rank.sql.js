"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankSql = void 0;
exports.rankSql = {
    patch: `
    INSERT INTO season_team_record (
      season_id,
      league_id,
      team_id,
      win,
      draw,
      lose,
      point,
      \`rank\`,
      \`section\`,
      \`section_idx\`
    )
    VALUES ?
    ON DUPLICATE KEY UPDATE
      win = VALUES(win),
      draw = VALUES(draw),
      lose = VALUES(lose),
      point = VALUES(point),
      \`rank\` = VALUES(\`rank\`),
      \`section\` = VALUES(\`section\`),
      \`section_idx\` = VALUES(\`section_idx\`);
  `
};
