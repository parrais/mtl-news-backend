const {
  fetchCommentsbyArticle,
  insertComment,
  eraseComment,
  changeCommentVotes,
} = require("../models/comments.models.js");
const { fetchArticleById } = require("../models/articles.models.js");

const getCommentsbyArticle = (request, response, next) => {
  const { article_id } = request.params;
  const commentsPromises = [fetchCommentsbyArticle(article_id)];
  if (article_id) {
    commentsPromises.push(fetchArticleById(article_id));
  }
  Promise.all(commentsPromises)
    .then((commentsPromises) => {
      const comments = commentsPromises[0];
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (request, response, next) => {
  const { article_id } = request.params;
  const { body, author } = request.body || { body: "", author: "" };
  const commentData = { article_id, body, author };
  insertComment(commentData)
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

const patchComment = (request, response, next) => {
  const { comment_id } = request.params;
  const { inc_votes } = request.body;
  changeCommentVotes(comment_id, inc_votes)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCommentsbyArticle,
  postComment,
  deleteComment,
  patchComment,
};
