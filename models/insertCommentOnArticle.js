const db = require("../db/connection");

const insertCommentOnArticle = (articleId, comment, next) => {
  const { username, body } = comment;
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, articleId]
    )
    .then(({ rows: [response] }) => {
      return response;
    })
    .catch((err) => {
      if (err.code === "23503") {
        err.message = `nothing at article_id: ${articleId}`;
      } else if (err.code === "22P02") {
        err.message = `article_id must be an integer`;
      }
      next(err);
    });
};

module.exports = insertCommentOnArticle;
