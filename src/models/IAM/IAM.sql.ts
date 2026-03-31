export const IAMSql = {
  postSignUp: "insert into user (user_id, name, email) values (?, ?, ?)",
  getLogin: "SELECT EXISTS(SELECT 1 FROM user WHERE user_id = ?) as isExistUser",
  delete: "delete from user where user_id = ?"
};
