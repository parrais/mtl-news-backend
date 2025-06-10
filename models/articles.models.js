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
    .query(
      "SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id",
      [article_id]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      article.comment_count = Number(article.comment_count);
      return article;
    });
};

const changeArticleVotes = (article_id, inc_votes) => {
  if (inc_votes === undefined) {
    inc_votes = 0;
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
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return article;
    });
};

const insertArticle = (author, title, body, topic, article_img_url) => {
  if (
    typeof title !== "string" ||
    title === "" ||
    typeof author !== "string" ||
    author === "" ||
    typeof topic !== "string" ||
    topic === "" ||
    typeof body !== "string" ||
    body === ""
  ) {
    return Promise.reject({
      status: 400,
      msg: `Invalid input`,
    });
  }
  if (!article_img_url || typeof article_img_url !== "string") {
    article_img_url =
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Breaking_News-Alert.png";
  }
  return db
    .query(
      `INSERT INTO articles(author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      const newArticleId = rows[0].article_id;
      return db.query(
        "SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id",
        [newArticleId]
      );
    })
    .then(({ rows }) => {
      const newArticle = rows[0];
      newArticle.comment_count = Number(newArticle.comment_count);
      return newArticle;
    });
};

module.exports = {
  fetchArticles,
  fetchArticleById,
  changeArticleVotes,
  insertArticle,
};
