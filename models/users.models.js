const db = require("../db/connection");

const fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

const fetchUser = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      const user = rows[0];
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: `No user found for username: ${username}`,
        });
      }
      return user;
    });
};

module.exports = { fetchUsers, fetchUser };
