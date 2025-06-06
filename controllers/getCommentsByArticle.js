const { selectCommentsByArticle } = require("../models");
const { checkArticleExists } = require("../utils");

const getCommentsByArticle = async (req, res, next) => {
  try {
    const articleId = Number(req.params["article_id"]);
    const statusPromise = checkArticleExists(articleId);
    const commentsPromise = selectCommentsByArticle(articleId, next);
    const [status, comments] = await Promise.all([
      statusPromise,
      commentsPromise,
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
    console.log(err);
    next(err);
  }
  // try {
  //   const articleId = Number(req.params["article_id"]);
  //   const comments = await selectCommentsByArticle(articleId, res, next);
  //   if (comments[0].comment_id === null) {
  //     res.status(204).send();
  //   }
  //   res.status(200).send({ comments: comments });
  // } catch {
  //   if (err) next(err);
  // }
};

module.exports = getCommentsByArticle;
