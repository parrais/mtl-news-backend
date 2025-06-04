const { fetchArticles } = require("../models/articles.models.js");

const getArticles = (request, response) => {
  fetchArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

module.exports = { getArticles };
