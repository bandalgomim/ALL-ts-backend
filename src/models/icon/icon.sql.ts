export const iconSql = {
    patchIcon:
    `INSERT INTO icon (user_id, type, id, icon)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    icon = VALUES(icon)
    `
};
