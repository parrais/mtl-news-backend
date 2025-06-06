const db = require("../db/connection");

const fetchTopics = () => {
  return db.query("SELECT slug, description FROM topics;").then(({ rows }) => {
    return rows;
  });
};

const fetchTopic = (topic) => {
  return db
    .query("SELECT * FROM topics WHERE slug = $1", [topic])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Topic does not exist" });
      }
    });
};

module.exports = { fetchTopics, fetchTopic };
