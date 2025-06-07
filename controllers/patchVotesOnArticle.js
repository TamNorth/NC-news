const { updateVotesOnArticle } = require("../models");
const { checkArticleExists } = require("../utils");

const patchVotesOnArticle = async (req, res, next) => {
  try {
    const { inc_votes } = req.body;
    const articleId = req.params["article_id"];
    const [response] = await Promise.all([
      //   checkArticleExists(articleId),
      updateVotesOnArticle(inc_votes, articleId),
    ]);
    res.status(200).send("sup");
  } catch {
    console.log("controller: " + err);
    next(err);
  }
};

module.exports = patchVotesOnArticle;
