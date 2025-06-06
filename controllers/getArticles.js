const selectArticles = require("../models/selectArticles");

const getArticles = async (req, res, next) => {
  return selectArticles()
    .then((rows) => {
      res.status(200).send({ articles: rows });
    })
    .catch((err) => next(err));
};

module.exports = getArticles;
