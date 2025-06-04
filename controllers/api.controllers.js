const endpointInfo = require("../endpoints.json");

const getEndpoints = (request, response) => {
  response.status(200).send({ endpoints: endpointInfo });
};

module.exports = { getEndpoints };
