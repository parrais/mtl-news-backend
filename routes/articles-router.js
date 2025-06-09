const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles.controllers.js");
const {
  getCommentsbyArticle,
  postComment,
} = require("../controllers/comments.controllers.js");

articlesRouter.get("/", getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsbyArticle)
  .post(postComment);

module.exports = articlesRouter;
