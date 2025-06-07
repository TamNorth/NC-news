const db = require("../db/connection");

const deleteComment = (commentId, next) => {
  return db
    .query(
      `DELETE FROM comments 
        WHERE comment_id = $1;`,
      [commentId]
    )
    .catch((err) => {
      if (err.code === "22P02") {
        err.message = `comment_id must be an integer`;
      }
      next(err);
    });
};

module.exports = deleteComment;
