const { selectArticleById } = require("../models");

const getArticleById = (req, res, next) => {
  selectArticleById(req.params["article_id"])
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = getArticleById;
