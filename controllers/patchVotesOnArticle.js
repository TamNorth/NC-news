const { updateVotesOnArticle } = require("../models");
const { checkArticleExists } = require("../utils");

const patchVotesOnArticle = async (req, res, next) => {
  try {
    const { inc_votes } = req?.body;
    const articleId = req.params["article_id"];
    const [status, response] = await Promise.all([
      checkArticleExists(articleId),
      updateVotesOnArticle(inc_votes, articleId),
    ]);
    if (status === 404) {
      return Promise.reject({ status: status, params: req.params });
    } else if (status === 200) {
      res.status(status).send({ article: response });
    } else {
      return Promise.reject({ status: 500 });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = patchVotesOnArticle;
