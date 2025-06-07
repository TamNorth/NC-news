const db = require("../db/connection.js");

const selectArticleById = (params) => {
  const articleId = params["article_id"];
  return db
    .query(
      `SELECT 
        articles.*, 
        COUNT(*) AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id 
      WHERE articles.article_id = $1 
      GROUP BY articles.article_id;`,
      [articleId]
    )
    .then(({ rows: [article] }) => {
      if (!article) {
        throw { status: 404, params: params };
      } else {
        article.comment_count = Number(article.comment_count);
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
