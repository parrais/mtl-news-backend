const db = require("../db/connection");

const fetchArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      const articles = rows.map((article) => {
        const correctedArticle = { ...article };
        correctedArticle.comment_count = Number(article.comment_count);
        return correctedArticle;
      });
      return articles;
    });
};

const fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return article;
    });
};

const fetchCommentsbyArticle = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `No article or comments found for article_id: ${article_id}`,
        });
      }
      return rows;
    });
};

const insertComment = (article_id, body, author) => {
  if (body === "") {
    return Promise.reject({
      status: 400,
      msg: `Invalid input: comment must not be blank`,
    });
  }
  return db
    .query(
      `INSERT INTO comments(article_id, body, author) VALUES ($1, $2, $3) RETURNING *`,
      [article_id, body, author]
    )
    .then(({ rows }) => {
      const newComment = rows[0];
      return newComment;
    });
};

module.exports = {
  fetchArticles,
  fetchArticleById,
  fetchCommentsbyArticle,
  insertComment,
};
