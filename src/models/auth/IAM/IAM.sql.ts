export const IAMSql = {
    postSignUp: "insert into user (user_id, email, name, icon_url) values (?, ?, ?, ?)",
    getLogin: "SELECT EXISTS(SELECT 1 FROM user WHERE user_id = ?) as isExistUser",
    getEmail: "SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail"
};
