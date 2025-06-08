const selectArticles = require("../models/selectArticles");
const format = require("pg-format");

const getArticles = async (req, res, next) => {
  const queries = req?.query;
  const sortingParam = queries?.sort_by || "created_at";
  const sortingOrder =
    queries?.order === "asc"
      ? "ASC"
      : queries?.order === "desc"
      ? "DESC"
      : queries?.order
      ? "ERROR"
      : queries?.sort_by
      ? "ASC"
      : "DESC";
  if (sortingOrder === "ERROR") {
    return Promise.reject({
      status: 400,
      message:
        "Bad request: order query must be provided as either 'asc' or 'desc'",
    });
  }
  const dbQuery = format(
    `SELECT 
      articles.*, 
      COUNT(comments.article_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON 
      articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    ORDER BY articles.%I %s;`,
    sortingParam,
    sortingOrder
  );
  return selectArticles(dbQuery)
    .then((rows) => {
      res.status(200).send({ articles: rows });
    })
    .catch((err) => next(err));
};

module.exports = getArticles;
