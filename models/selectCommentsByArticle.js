const db = require("../db/connection");

const selectCommentsByArticle = (articleId, res, next) => {
  return db
    .query(
      `SELECT articles.article_id AS article_exists, comments.* FROM comments FULL OUTER JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id = $1`,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length) {
        console.log(rows);
        return rows;
      } else {
        return Promise.reject({
          status: 404,
          message: `No article found for article_id: ${articleId}`,
        });
      }
    })
    .catch((err) => next(err));
};

module.exports = selectCommentsByArticle;
