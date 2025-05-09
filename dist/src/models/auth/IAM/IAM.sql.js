"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IAMSql = void 0;
exports.IAMSql = {
    postSignUp: "insert into user (user_id, email, nickname, icon) values (?, ?, ?, ?)",
    getLogin: "SELECT EXISTS(SELECT 1 FROM user WHERE user_id = ?) as isExistUser",
    getEmail: "SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail",
    patchFcmToken: "UPDATE user SET fcm_token = ? WHERE user_id = ?"
};
