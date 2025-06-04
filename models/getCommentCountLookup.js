const { get } = require("../app.js");
const db = require("../db/connection.js");

const getCommentCountLookup = () => {
  return db
    .query(
      `SELECT article_id, COUNT(comment_id) FROM comments GROUP BY (article_id);`
    )
    .then(({ rows: commentCounts }) => {
      const commentCountLookup = {};
      for (let article of commentCounts) {
        commentCountLookup[article.article_id] = +article.count;
      }
      return commentCountLookup;
    });
};

module.exports = getCommentCountLookup;
