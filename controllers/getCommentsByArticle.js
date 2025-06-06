const { selectCommentsByArticle } = require("../models");
const { checkArticleExists } = require("../utils");

const getCommentsByArticle = async (req, res, next) => {
  try {
    const articleId = Number(req.params["article_id"]);
    const [status, comments] = await Promise.all([
      checkArticleExists(articleId),
      selectCommentsByArticle(articleId, next),
    ]);
    if (status === 200) {
      res.status(status).send({ comments: comments });
    } else if (status === 404) {
      return Promise.reject({
        status: status,
        message: `No article found for article_id: ${articleId}`,
      });
    }
  } catch {
    next(err);
  }
};

module.exports = getCommentsByArticle;
