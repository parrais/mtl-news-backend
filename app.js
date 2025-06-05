const express = require("express");
const app = express();
const { getEndpoints } = require("./controllers/api.controllers.js");
const { getTopics } = require("./controllers/topics.controllers.js");
const {
  getArticles,
  getArticleById,
  getCommentsbyArticle,
  postComment,
  patchArticleById,
} = require("./controllers/articles.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");
const {
  handleCustomErrors,
  handleDatabaseErrors,
  handleServerErrors,
} = require("./errors.js");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsbyArticle);

app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchArticleById);
app.post("/api/articles/:article_id/comments", postComment);

app.use(handleCustomErrors);

app.use(handleDatabaseErrors);

app.use(handleServerErrors);

module.exports = app;
