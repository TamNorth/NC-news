const db = require("../db/connection");

const updateVotesOnArticle = (votes, articleId) => {
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
      console.log("model: " + err);
      next(err);
    });
};

module.exports = updateVotesOnArticle;
