const db = require("../db/connection");
const format = require("pg-format");

const fetchArticles = ({ sort_by, order, topic }) => {
  const DEFAULT_SORT_COLUMN = "created_at";
  const DEFAULT_ORDER = "desc";
  if (sort_by === undefined) {
    sort_by = DEFAULT_SORT_COLUMN;
  }
  if (order === undefined) {
    order = DEFAULT_ORDER;
  }
  const allowedSortColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const allowedOrders = ["asc", "desc"];
  if (!allowedSortColumns.includes(sort_by) || !allowedOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Input" });
  }

  const queryParams = [];
  let queryString =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON articles.article_id = comments.article_id ";

  if (topic) {
    queryParams.push(topic);
    queryString += `WHERE topic = $${queryParams.length} `;
  }

  queryString += "GROUP BY articles.article_id ORDER BY articles.%I";

  if (order === "asc") {
    queryString += " ASC;";
  } else {
    queryString += " DESC;";
  }

  QueryString = format(queryString, sort_by);

  return db.query(QueryString, queryParams).then(({ rows }) => {
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
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
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

const changeArticleVotes = (article_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input: no votes received",
    });
  }
  return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *",
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
  changeArticleVotes,
};
