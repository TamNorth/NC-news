const db = require("../db/connection");

const selectCommentsByArticle = (articleId, next) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [articleId])
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      if (err) next(err);
    });
};

module.exports = selectCommentsByArticle;
