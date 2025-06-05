const {
  fetchArticles,
  fetchArticleById,
  fetchCommentsbyArticle,
  insertComment,
} = require("../models/articles.models.js");

const getArticles = (request, response) => {
  fetchArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

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

module.exports = {
  getArticles,
  getArticleById,
  getCommentsbyArticle,
  postComment,
};
