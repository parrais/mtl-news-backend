const { fetchEndpoints } = require("../models/api.models.js");

const getEndpoints = (request, response) => {
  fetchEndpoints().then((endpoints) => {
    response.status(200).send({ endpoints });
  });
};

module.exports = { getEndpoints };
