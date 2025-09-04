"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translatorSql = void 0;
exports.translatorSql = {
    post: (data) => {
        return `INSERT INTO match_url (match_id, platform_id, type, url) 
        VALUES ${data}
    ON DUPLICATE KEY UPDATE
        platform_id = VALUES(platform_id),
        url = VALUES(url)`;
    }
};
