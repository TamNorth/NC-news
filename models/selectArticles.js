const db = require("../db/connection");

const selectArticles = () => {
  return db
    .query(
      `SELECT 
        articles.*, 
        COUNT(comments.article_id) AS comment_count
      FROM articles 
      LEFT JOIN comments ON 
        articles.article_id = comments.article_id 
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      rows.forEach((row) => {
        row.comment_count = Number(row.comment_count);
        delete row.body;
      });
      return rows;
    })
    .catch((err) => {
      return err;
    });
};

module.exports = selectArticles;
