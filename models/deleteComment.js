const db = require("../db/connection");

const deleteComment = (commentId) => {
  return db
    .query(
      `DELETE FROM comments 
        WHERE comment_id = $1
        RETURNING *;`,
      [commentId]
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      if (err.code === "22P02") {
        err.message = `comment_id must be an integer`;
      }
      throw err;
    });
};

module.exports = deleteComment;
