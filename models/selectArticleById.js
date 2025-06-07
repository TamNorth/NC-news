const db = require("../db/connection.js");

const selectArticleById = (params) => {
  const articleId = params["article_id"];
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rows: [article] }) => {
      if (!article) {
        throw { status: 404, params: params };
      } else {
        return article;
      }
    })
    .catch((err) => {
      if (err.code === "22P02") {
        err.message = `article_id must be an integer`;
      }
      throw err;
    });
};

module.exports = selectArticleById;
