const db = require("../db/connection");

const selectCommentsByArticle = (articleId, query, res, next) => {
  return db
    .query(query)
    .then(
      ([
        {
          rows: [articleExists],
        },
        { rows },
      ]) => {
        if (articleExists) {
          return rows;
        } else {
          return Promise.reject({
            status: 404,
            message: `No article found for article_id: ${articleId}`,
          });
        }
      }
    )
    .catch((err) => next(err));
};

module.exports = selectCommentsByArticle;
