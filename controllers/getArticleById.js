const db = require("../db/connection.js");

const getArticleById = (req, res, next) => {
  const articleId = req.params["article_id"];
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rows: [article] }) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          message: `No article found for article_id: ${articleId}`,
        });
      }
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      return next(err);
    });
};

module.exports = getArticleById;
