const db = require("../db/connection");

const selectCommentsByArticle = (articleId) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [articleId])
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      if (err.code === "22P02") {
        err.message = `article_id must be an integer`;
      }
      throw err;
    });
};

module.exports = selectCommentsByArticle;
