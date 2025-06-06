const endpointInfo = require("../endpoints.json");

const getEndpoints = (request, response) => {
  response.status(200).send({ endpoints: endpointInfo });
};

const respondToInvalidEndpoint = (request, response) => {
  response.status(404).send({ msg: "Endpoint not found" });
};

module.exports = { getEndpoints, respondToInvalidEndpoint };
