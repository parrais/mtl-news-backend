const express = require("express");
const app = express();
const { getEndpoints } = require("./controllers/api.controllers.js");
const { getTopics } = require("./controllers/topics.controllers.js");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

module.exports = app;
