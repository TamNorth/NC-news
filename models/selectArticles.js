const db = require("../db/connection");

const selectArticles = (dbQuery) => {
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
      if (err.code === "42703") {
        err.message = "specified sorting parameter does not exist";
      }
      throw err;
    });
};

module.exports = selectArticles;
