const { deleteComment } = require("../models");

const removeComment = async (req, res, next) => {
  const commentId = req.params["comment_id"];
  return deleteComment(commentId, next)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = removeComment;
