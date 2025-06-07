const db = require("../db/connection");

const updateVotesOnArticle = (votes, articleId, next) => {
  return db
    .query(
      `UPDATE articles
            SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *;`,
      [votes, articleId]
    )
    .then(({ rows: [article] }) => {
      return article;
    })
    .catch((err) => {
      console.log("model:");
      console.log(err);
      if (err.code === "22P02") {
        err.message = `article_id must be an integer`;
      }
      next(err);
    });
};

module.exports = updateVotesOnArticle;
