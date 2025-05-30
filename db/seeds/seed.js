const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createRef } = require("./utils");
const { dropTables, createTables } = require("./rebuild-tables");

const seed = ({
  topicData,
  userData,
  articleData,
  commentData,
  userTopicData,
}) => {
  return dropTables()
    .then(() => {
      return createTables();
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
      const formattedUsersTopics = userTopicData.map(({ username, topic }) => {
        return [username, topic];
      });
      const UserTopicInsertString = format(
        // FIX THIS IN BRACKETS
        `INSERT INTO users_topics
                (username, topic) 
        VALUES %L RETURNING *`,
        formattedUsersTopics
      );
      return db.query(UserTopicInsertString);
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
      const articleLookup = createRef(rows, "title", "article_id");
      const formattedComments = commentData.map((record) => {
        const correctedRecord = convertTimestampToDate(record);
        return [
          articleLookup[correctedRecord.article_title],
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
