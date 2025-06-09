const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleById,
  postArticle,
} = require("../controllers/articles.controllers.js");
const {
  getCommentsbyArticle,
  postComment,
} = require("../controllers/comments.controllers.js");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsbyArticle)
  .post(postComment);

module.exports = articlesRouter;
