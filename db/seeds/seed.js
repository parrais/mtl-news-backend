const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, convertArticleToId } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics(
      slug VARCHAR(20) PRIMARY KEY NOT NULL,
      description VARCHAR(100),
      img_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
      username VARCHAR(20) PRIMARY KEY NOT NULL,
      name VARCHAR(100),
      avatar_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      topic VARCHAR(20) REFERENCES topics(slug),
      author VARCHAR(20) REFERENCES users(username),
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      article_id INT NOT NULL REFERENCES articles(article_id),
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      author VARCHAR(20) NOT NULL REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);
    })
    .then(() => {
      const formattedTopics = topicData.map((record) => {
        return [record.slug, record.description, record.img_url];
      });
      const TopicInsertString = format(
        `INSERT INTO topics
        (slug, description, img_url)
        VALUES %L RETURNING *`,
        formattedTopics
      );
      return db.query(TopicInsertString);
    })
    .then(() => {
      const formattedUsers = userData.map((record) => {
        return [record.username, record.name, record.avatar_url];
      });
      const UserInsertString = format(
        `INSERT INTO users
        (username, name, avatar_url)
        VALUES %L RETURNING *`,
        formattedUsers
      );
      return db.query(UserInsertString);
    })
    .then(() => {
      const formattedArticles = articleData.map((record) => {
        const correctedRecord = convertTimestampToDate(record);
        return [
          correctedRecord.title,
          correctedRecord.topic,
          correctedRecord.author,
          correctedRecord.body,
          correctedRecord.votes,
          correctedRecord.created_at,
          correctedRecord.article_img_url,
        ];
      });
      const ArticleInsertString = format(
        `INSERT INTO articles
        (title, topic, author, body, votes, created_at, article_img_url)
        VALUES %L RETURNING *`,
        formattedArticles
      );
      return db.query(ArticleInsertString);
    })
    .then(({ rows }) => {
      const formattedComments = commentData.map((record) => {
        const correctedRecord = convertTimestampToDate(record);
        const articleId = convertArticleToId(record.article_title, rows);
        return [
          articleId,
          correctedRecord.body,
          correctedRecord.votes,
          correctedRecord.author,
          correctedRecord.created_at,
        ];
      });
      const commentInsertString = format(
        `INSERT INTO comments
        (article_id, body, votes, author, created_at)
        VALUES %L RETURNING *`,
        formattedComments
      );
      return db.query(commentInsertString);
    });
};
module.exports = seed;
