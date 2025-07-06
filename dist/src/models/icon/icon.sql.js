"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iconSql = void 0;
exports.iconSql = {
    patchIcon: `INSERT INTO icon (user_id, type, id, icon)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    icon = VALUES(icon)
    `
};
