const { selectArticleById } = require("../models");

const getArticleById = (req, res, next) => {
  return selectArticleById(req.params, next)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = getArticleById;
