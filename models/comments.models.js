const db = require("../db/connection");
const { commentData } = require("../db/data/test-data");

const fetchCommentsbyArticle = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

const insertComment = (commentData) => {
  const { article_id, body, author } = commentData;
  if (
    typeof body !== "string" ||
    body === "" ||
    typeof author !== "string" ||
    author === "" ||
    typeof article_id !== "string" ||
    article_id === ""
  ) {
    return Promise.reject({
      status: 400,
      msg: `Invalid input`,
    });
  }
  return db
    .query(
      `INSERT INTO comments(article_id, body, author) VALUES ($1, $2, $3) RETURNING *`,
      [article_id, body, author]
    )
    .then(({ rows }) => {
      const newComment = rows[0];
      if (!newComment) {
        return Promise.reject({
          status: 404,
          msg: "Invalid input: article or user not found",
        });
      }
      return newComment;
    });
};

const eraseComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      const deletedComment = rows[0];
      if (!deletedComment) {
        return Promise.reject({
          status: 404,
          msg: `Invalid input: no comment to delete with comment_id: ${comment_id}`,
        });
      }
      return deletedComment;
    });
};

const changeCommentVotes = (comment_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input: no votes received",
    });
  }
  return db
    .query(
      "UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *",
      [comment_id, inc_votes]
    )
    .then(({ rows }) => {
      const comment = rows[0];
      if (!comment) {
        return Promise.reject({
          status: 400,
          msg: `No comment found for comment_id: ${comment_id}`,
        });
      }
      return comment;
    });
};

module.exports = {
  fetchCommentsbyArticle,
  insertComment,
  eraseComment,
  changeCommentVotes,
};
