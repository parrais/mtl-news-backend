const fs = require("fs/promises");

const fetchEndpoints = () => {
  return fs.readFile("./endpoints.json", "utf-8").then((endpointInfo) => {
    return JSON.parse(endpointInfo);
  });
};

module.exports = { fetchEndpoints };
