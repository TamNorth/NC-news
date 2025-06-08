const selectArticles = require("../models/selectArticles");

const getArticles = async (req, res, next) => {
  const queries = req?.query;
  // console.log(queries);
  return selectArticles(queries)
    .then((rows) => {
      res.status(200).send({ articles: rows });
    })
    .catch((err) => next(err));
};

module.exports = getArticles;
