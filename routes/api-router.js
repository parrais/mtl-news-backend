const express = require("express");
const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const { getEndpoints } = require("../controllers/api.controllers.js");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.use("/", express.static("public"));

module.exports = apiRouter;
