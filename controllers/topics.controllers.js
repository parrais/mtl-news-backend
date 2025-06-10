const { fetchTopics, insertTopic } = require("../models/topics.models.js");

const getTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

const postTopic = (request, response, next) => {
  const { slug, description } = request.body || { slug: "", description: "" };
  insertTopic(slug, description)
    .then((topic) => {
      response.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics, postTopic };
