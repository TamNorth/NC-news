const { selectCommentsByArticle } = require("../models");

const getCommentsByArticle = async (req, res, next) => {
  try {
    const articleId = Number(req.params["article_id"]);
    const comments = await selectCommentsByArticle(articleId, res, next);
    if (comments[0].comment_id === null) {
      res.status(204).send();
    }
    res.status(200).send({ comments: comments });
  } catch {
    if (err) next(err);
  }
};

module.exports = getCommentsByArticle;
