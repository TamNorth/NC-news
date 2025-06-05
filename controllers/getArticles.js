const db = require("../db/connection.js");
const {
  getCommentCountLookup,
  sortArticlesByDate,
} = require("../models/index.js");
const { appendPropertyByLookup } = require("../utils.js");

const getArticles = async (req, res) => {
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
    const articlesByDateWithCommentCount = sortArticlesByDate(
      articlesWithCommentCount
    );
    res.status(200).send({ articles: articlesByDateWithCommentCount });
  } catch {
    if (err) console.log(err);
  }
};

module.exports = getArticles;
