"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iconSql = void 0;
exports.iconSql = {
    patchIcon: `INSERT INTO icon (user_id, type, id, icon)
        VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        user_id = VALUES(user_id),
        type = VALUES(type),
        id = VALUES(id),
        icon = VALUES(icon);`,
    deleteIcon: "DELETE FROM icon WHERE user_id = ? AND type = ? AND id = ?;"
};
