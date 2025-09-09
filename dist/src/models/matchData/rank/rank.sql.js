"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankSql = void 0;
exports.rankSql = {
    // 여러 팀을 한 번에 UPDATE
    updateBulk: (rows) => {
        // team_id IN (...) 절
        const idsPlaceholders = rows.map(() => "?").join(", ");
        // 각 컬럼의 CASE WHEN 절을 동적으로 생성
        const buildCase = (col) => `\`${String(col)}\` = CASE \`team_id\`
        ${rows.map(() => "  WHEN ? THEN ?").join("\n")}
        ELSE \`${String(col)}\` END`;
        const sql = `
            UPDATE \`team\`
            SET
            ${buildCase("win")},
            ${buildCase("draw")},
            ${buildCase("rose")},
            ${buildCase("point")},
            ${buildCase("rank")},
            ${buildCase("section")}
            WHERE \`team_id\` IN (${idsPlaceholders});
            `.trim();
        // 파라미터 순서: 각 컬럼별로 (team_id, 값) * N 을 쌓고, 마지막에 IN (...)의 team_id 들
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params = [];
        const pushPairs = (key) => {
            for (const r of rows) {
                params.push(r.teamId, r[key]);
            }
        };
        pushPairs("win");
        pushPairs("draw");
        pushPairs("rose");
        pushPairs("point");
        pushPairs("rank");
        pushPairs("section");
        // WHERE IN (...) team_id 들
        for (const r of rows)
            params.push(r.teamId);
        return { sql, params };
    }
};
