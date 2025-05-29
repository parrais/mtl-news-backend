const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.convertArticleToId = (articleName, inputData) => {
  let articleId = 0;
  for (const article of inputData) {
    if (articleName === article.title) {
      articleId = article.article_id;
    }
  }
  return articleId;
};
