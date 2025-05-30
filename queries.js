const db = require("./db/connection");

function displayQueries() {
  console.log("Get all of the users");
  return db
    .query(`SELECT username, name FROM users;`)
    .then((response) => {
      console.log(response.rows);
    })
    .then(() => {
      console.log("Get all of the articles where the topic is coding");
      return db.query(`SELECT title FROM articles WHERE topic = 'coding';`);
    })
    .then((response) => {
      console.log(response.rows);
    })
    .then(() => {
      console.log("Get all of the comments where the votes are less than zero");
      return db.query(`SELECT * FROM comments WHERE votes < 0;`);
    })
    .then((response) => {
      console.log(response.rows);
    })
    .then(() => {
      console.log("Get all of the topics");
      return db.query(`SELECT slug, description FROM topics;`);
    })
    .then((response) => {
      console.log(response.rows);
    })
    .then(() => {
      console.log("Get all of the articles by user grumpy19");
      return db.query(
        `SELECT title, author FROM articles WHERE author = 'grumpy19';`
      );
    })
    .then((response) => {
      console.log(response.rows);
    })
    .then(() => {
      console.log("Get all of the comments that have more than 10 votes.");
      return db.query(`SELECT * FROM comments WHERE votes > 10;`);
    })
    .then((response) => {
      console.log(response.rows);
    })
    .catch((error) => {
      console.log(error);
    });
}
return displayQueries();
