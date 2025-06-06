const {
  fetchCommentsbyArticle,
  insertComment,
  eraseComment,
} = require("../models/comments.models.js");

const getCommentsbyArticle = (request, response, next) => {
  const { article_id } = request.params;
  fetchCommentsbyArticle(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (request, response, next) => {
  const { article_id } = request.params;
  const { body, author } = request.body;
  insertComment(article_id, body, author)
    .then((newComment) => {
      response.status(201).send({ newComment });
    })
    .catch((err) => {
      next(err);
    });
};

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
module.exports = { getCommentsbyArticle, postComment, deleteComment };
