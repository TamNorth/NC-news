const { insertCommentOnArticle } = require("../models");
const { checkArticleExists } = require("../utils");

const postCommentOnArticle = async (req, res, next) => {
  try {
    const articleId = req.params["article_id"];
    const comment = req.body;
    if (typeof comment.body !== "string") {
      next({
        status: 400,
        message: "Bad request: comment body must be a string",
      });
    }
    const response = await insertCommentOnArticle(articleId, comment, next);
    res.status(201).send(response);
  } catch {
    next(err);
  }
};

module.exports = postCommentOnArticle;
