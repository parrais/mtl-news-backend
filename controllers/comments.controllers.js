const { eraseComment } = require("../models/comments.models.js");

const deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  eraseComment(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = { deleteComment };
