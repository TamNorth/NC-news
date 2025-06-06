const { insertCommentOnArticle } = require("../models");
const { checkArticleExists } = require("../utils");

const postCommentOnArticle = async (req, res, next) => {
  try {
    const comment = req.body;
    const response = await insertCommentOnArticle(req.params, comment, next);
    res.status(201).send(response);
  } catch {
    console.log(err);
    next(err);
  }
};

module.exports = postCommentOnArticle;
