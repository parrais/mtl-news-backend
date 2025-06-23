const express = require("express");
const app = express();
const cors = require("cors");
const apiRouter = require("./routes/api-router");
const {
  respondToInvalidEndpoint,
} = require("./controllers/api.controllers.js");
const {
  handleCustomErrors,
  handleDatabaseErrors,
  handleServerErrors,
} = require("./errors.js");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(respondToInvalidEndpoint);

app.use(handleCustomErrors);

app.use(handleDatabaseErrors);

app.use(handleServerErrors);

module.exports = app;
