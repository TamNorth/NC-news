const db = require("../db/connection.js");

const selectArticleById = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rows: [article] }) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          message: `No article found for article_id: ${articleId}`,
        });
      } else {
        return article;
      }
    });
};

module.exports = selectArticleById;
