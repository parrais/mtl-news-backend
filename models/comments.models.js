const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");

const eraseComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      const deletedComment = rows[0];
      if (!deletedComment) {
        return Promise.reject({
          status: 400,
          msg: `Invalid input: no comment to delete with comment_id: ${comment_id}`,
        });
      }
      return deletedComment;
    });
};

module.exports = { eraseComment };
