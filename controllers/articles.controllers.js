const {
  fetchArticles,
  fetchArticleById,
  changeArticleVotes,
  insertArticle,
} = require("../models/articles.models.js");
const { fetchTopic } = require("../models/topics.models.js");

const getArticles = (request, response, next) => {
  const { sort_by, order, topic } = request.query;
  const articlesPromises = [fetchArticles({ sort_by, order, topic })];

  if (topic) {
    articlesPromises.push(fetchTopic(topic));
  }

  Promise.all(articlesPromises)
    .then((articlesPromises) => {
      const articles = articlesPromises[0];
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
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

const patchArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  changeArticleVotes(article_id, inc_votes)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const postArticle = (request, response, next) => {
  const { author, title, body, topic, article_img_url } = request.body || {
    author: "",
    title: "",
    body: "",
    topic: "",
    article_img_url: "",
  };
  insertArticle(author, title, body, topic, article_img_url)
    .then((newArticle) => {
      response.status(201).send({ newArticle });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticles,
  getArticleById,
  patchArticleById,
  postArticle,
};
