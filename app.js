const express = require("express");
const app = express();
const { getEndpoints } = require("./controllers/api.controllers.js");

app.get("/api", getEndpoints);

module.exports = app;
