const { selectCommentsByArticle } = require("../models");
const format = require("pg-format");

const getCommentsByArticle = async (req, res, next) => {
  try {
    const articleId = Number(req.params["article_id"]);
    const query = format(
      `SELECT article_id FROM articles WHERE article_id = %L; SELECT * FROM comments WHERE article_id = %L`,
      articleId,
      articleId
    );
    const comments = await selectCommentsByArticle(articleId, query, res, next);
    if (comments.length === 0) {
      res.status(204).send();
    }
    res.status(200).send({ comments: comments });
  } catch {
    if (err) next(err);
  }
};

module.exports = getCommentsByArticle;
