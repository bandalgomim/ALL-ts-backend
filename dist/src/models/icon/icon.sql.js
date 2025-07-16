"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iconSql = void 0;
exports.iconSql = {
    patchIcon: `INSERT INTO icon (user_id, type, id, uri)
        VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        user_id = VALUES(user_id),
        type = VALUES(type),
        id = VALUES(id),
        uri = VALUES(uri);`
};
