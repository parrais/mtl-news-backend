const db = require("../db/connection");

const fetchArticles = (topic) => {
  const queryParams = [];
  let queryString =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON articles.article_id = comments.article_id ";

  if (topic) {
    queryParams.push(topic);
    queryString += `WHERE topic = $${queryParams.length} `;
  }

  queryString +=
    "GROUP BY articles.article_id ORDER BY articles.created_at DESC;";

  return db.query(queryString, queryParams).then(({ rows }) => {
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

const changeVotes = (article_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({
      status: 400,
      msg: `Invalid input: no votes received`,
    });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *`,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 400,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return article;
    });
};

module.exports = {
  fetchArticles,
  fetchArticleById,
  changeVotes,
};
