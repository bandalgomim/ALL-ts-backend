"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IAMSql = void 0;
exports.IAMSql = {
    postSignUp: "insert into user (user_id, name, email, icon) values (?, ?, ?, ?)",
    getLogin: "SELECT EXISTS(SELECT 1 FROM user WHERE user_id = ?) as isExistUser",
    delete: "delete from user where user_id = ?"
};
