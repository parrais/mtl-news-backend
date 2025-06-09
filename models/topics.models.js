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

const insertTopic = (slug, description) => {
  if (
    typeof slug !== "string" ||
    !slug ||
    typeof description !== "string" ||
    !description
  ) {
    return Promise.reject({
      status: 400,
      msg: `Invalid input`,
    });
  }

  return db
    .query(
      `INSERT INTO topics(slug, description) VALUES ($1, $2) RETURNING *`,
      [slug, description]
    )
    .then(({ rows }) => {
      const topic = rows[0];
      return topic;
    });
};

module.exports = { fetchTopics, fetchTopic, insertTopic };
