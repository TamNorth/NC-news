const db = require("../db/connection");
const format = require("pg-format");

const selectArticles = (queries) => {
  const sortingParam = queries?.sort_by || "created_at";
  const sortingOrder = queries?.sort_by ? "ASC" : "DESC";
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
  return db
    .query(dbQuery)
    .then(({ rows }) => {
      rows.forEach((row) => {
        row.comment_count = Number(row.comment_count);
        delete row.body;
      });
      return rows;
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = selectArticles;
