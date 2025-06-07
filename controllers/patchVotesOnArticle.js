const { updateVotesOnArticle } = require("../models");
const { checkArticleExists } = require("../utils");

const patchVotesOnArticle = async (req, res, next) => {
  try {
    const { inc_votes } = req.body;
    const articleId = req.params["article_id"];
    if (typeof inc_votes !== "number" || inc_votes % 1 !== 0) {
      next({
        status: 400,
        message:
          "Bad request: votes to add must be supplied in the format {inc_votes: <votes>} where <votes> is a number",
      });
      return;
    }
    const [status, response] = await Promise.all([
      checkArticleExists(articleId),
      updateVotesOnArticle(inc_votes, articleId, next),
    ]);
    if (status === 404) {
      return Promise.reject({ status: status, params: req.params });
    }
    res.status(status).send({ article: response });
  } catch {
    console.log("controller: " + err);
    next(err);
  }
};

module.exports = patchVotesOnArticle;
