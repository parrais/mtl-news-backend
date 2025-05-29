const db = require("./db/connection");

// Get all of the users
db.query(`SELECT username, name FROM users;`)
  .then((response) => {
    console.log(response.rows);
  })
  .catch((error) => {
    console.log(error);
  });

// Get all of the articles where the topic is coding
db.query(`SELECT title FROM articles WHERE topic = 'coding';`)
  .then((response) => {
    console.log(response.rows);
  })
  .catch((error) => {
    console.log(error);
  });

// Get all of the comments where the votes are less than zero
db.query(`SELECT * FROM comments WHERE votes < 0;`)
  .then((response) => {
    console.log(response.rows);
  })
  .catch((error) => {
    console.log(error);
  });

// Get all of the topics
db.query(`SELECT slug, description FROM topics;`)
  .then((response) => {
    console.log(response.rows);
  })
  .catch((error) => {
    console.log(error);
  });

// Get all of the articles by user grumpy19
db.query(`SELECT title, author FROM articles WHERE author = 'grumpy19';`)
  .then((response) => {
    console.log(response.rows);
  })
  .catch((error) => {
    console.log(error);
  });

// Get all of the comments that have more than 10 votes.
db.query(`SELECT * FROM comments WHERE votes > 10;`)
  .then((response) => {
    console.log(response.rows);
  })
  .catch((error) => {
    console.log(error);
  });
