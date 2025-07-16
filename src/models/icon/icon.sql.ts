export const iconSql = {
    patchIcon:
    `INSERT INTO icon (user_id, type, id, uri)
        VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        user_id = VALUES(user_id),
        type = VALUES(type),
        id = VALUES(id),
        uri = VALUES(uri);`
};

