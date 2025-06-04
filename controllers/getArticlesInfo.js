const db = require("../db/connection.js");
const {
  getCommentCountLookup,
  sortArticlesByDate,
  appendPropertyByLookup,
} = require("../models");

const getArticlesInfo = async (req, res) => {
  try {
    const { rows: articles } = await db.query(`SELECT * FROM articles;`);
    const commentCountLookup = await getCommentCountLookup();
    articles.forEach((article) => {
      delete article.body;
    });
    appendPropertyByLookup(
      articles,
      "article_id",
      "comment_count",
      commentCountLookup
    );
    sortArticlesByDate(articles);
    res.status(200).send({ articles: articles });
  } catch {
    if (err) console.log(err);
  }
};

module.exports = getArticlesInfo;
