const { deleteComment } = require("../models");
const { checkCommentExists } = require("../utils");

const removeComment = async (req, res, next) => {
  const commentId = req.params["comment_id"];
  return deleteComment(commentId, next)
    .then((deletedComment) => {
      if (deletedComment.length === 0) {
        return Promise.reject({ status: 404, params: req.params });
      }
      return res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = removeComment;
