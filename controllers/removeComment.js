const { deleteComment } = require("../models");
const { checkCommentExists } = require("../utils");

const removeComment = async (req, res, next) => {
  try {
    const commentId = req.params["comment_id"];
    const [status] = await Promise.all([
      checkCommentExists(commentId),
      deleteComment(commentId, next),
    ]);
    if (status === 404) {
      return Promise.reject({ status: status, params: req.params });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = removeComment;
