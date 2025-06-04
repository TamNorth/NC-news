const db = require("../db/connection.js");
const { getCommentCountLookup, sortArticlesByDate } = require("../models");
const { appendPropertyByLookup } = require("../utils.js");

const getArticlesInfo = async (req, res) => {
  try {
    const { rows: articles } = await db.query(`SELECT * FROM articles;`);
    const commentCountLookup = await getCommentCountLookup();
    articles.forEach((article) => {
      delete article.body;
    });
    const articlesWithCommentCount = appendPropertyByLookup(
      articles,
      "article_id",
      "comment_count",
      commentCountLookup
    );
    sortArticlesByDate(articlesWithCommentCount);
    res.status(200).send({ articles: articlesWithCommentCount });
  } catch {
    if (err) console.log(err);
  }
};

module.exports = getArticlesInfo;
