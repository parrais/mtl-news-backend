const express = require("express");
const app = express();
const { getEndpoints } = require("./controllers/api.controllers.js");
const { getTopics } = require("./controllers/topics.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

module.exports = app;
