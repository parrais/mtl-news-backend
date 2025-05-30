const db = require("../../db/connection");

exports.dropTables = () => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users_topics;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`);
    });
};

exports.createTables = () => {
  return db
    .query(
      `CREATE TABLE topics(
      slug VARCHAR(20) PRIMARY KEY NOT NULL,
      description VARCHAR(100),
      img_url VARCHAR(1000));`
    )
    .then(() => {
      return db.query(`CREATE TABLE users(
      username VARCHAR(20) PRIMARY KEY NOT NULL,
      name VARCHAR(100),
      avatar_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users_topics(
      user_topic_id SERIAL PRIMARY KEY,
      username VARCHAR(20) NOT NULL REFERENCES users(username),
      topic VARCHAR(20) NOT NULL REFERENCES topics(slug));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      topic VARCHAR(20) REFERENCES topics(slug),
      author VARCHAR(20) NOT NULL REFERENCES users(username),
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
    });
};
