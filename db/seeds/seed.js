const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate } = require("./utils");

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
      slug VARCHAR(20) PRIMARY KEY,
      description VARCHAR(100),
      img_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
      username VARCHAR(20) PRIMARY KEY,
      name VARCHAR(100),
      avatar_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(200),
      topic VARCHAR(20) REFERENCES topics(slug),
      author VARCHAR(20) REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id),
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR(20) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);
    })
    .then(() => {
      const formattedTopics = topicData.map(
        ({ slug, description, img_url }) => {
          return [slug, description, img_url];
        }
      );
      const TopicInsertString = format(
        `INSERT INTO topics
        (slug, description, img_url)
        VALUES %L RETURNING *`,
        formattedTopics
      );
      return db.query(TopicInsertString);
    })
    .then(() => {
      const formattedUsers = userData.map(({ username, name, avatar_url }) => {
        return [username, name, avatar_url];
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
      const DateCorrectedArticles = articleData.map((record) => {
        return convertTimestampToDate(record);
      });
      const formattedArticles = DateCorrectedArticles.map(
        ({
          title,
          topic,
          author,
          body,
          votes,
          created_at,
          article_img_url,
        }) => {
          return [
            title,
            topic,
            author,
            body,
            votes,
            created_at,
            article_img_url,
          ];
        }
      );
      const ArticleInsertString = format(
        `INSERT INTO articles
        (title, topic, author, body, votes, created_at, article_img_url)
        VALUES %L RETURNING *`,
        formattedArticles
      );
      return db.query(ArticleInsertString);
    });
};
module.exports = seed;
