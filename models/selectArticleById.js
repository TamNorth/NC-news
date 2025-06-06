const db = require("../db/connection.js");

const selectArticleById = (params, next) => {
  const articleId = params["article_id"];
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rows: [article] }) => {
      if (!article) {
        next({ status: 404, params: params });
      } else {
        return article;
      }
    })
    .catch((err) => {
      if (err.code === "22P02") {
        err.message = `article_id must be an integer`;
      }
      next(err);
    });
};

module.exports = selectArticleById;
