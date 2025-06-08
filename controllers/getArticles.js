const selectArticles = require("../models/selectArticles");
const format = require("pg-format");
const { checkTopicExists } = require("../utils");

const getArticles = async (req, res, next) => {
  try {
    const queries = req?.query;
    const topic = queries?.topic;
    const topicExistsPromise = topic ? checkTopicExists(topic) : null;
    const sortingParam = queries?.sort_by || "created_at";
    const sortingOrder =
      queries?.order === "asc"
        ? "ASC"
        : queries?.order === "desc"
        ? "DESC"
        : queries?.order
        ? "ERROR"
        : queries?.sort_by
        ? "ASC"
        : "DESC";
    if (sortingOrder === "ERROR") {
      return Promise.reject({
        status: 400,
        message:
          "Bad request: order query must be provided as either 'asc' or 'desc'",
      });
    }
    let dbQueryBuilder = `SELECT 
      articles.*, 
      COUNT(comments.article_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON 
      articles.article_id = comments.article_id `;
    if (topic) {
      dbQueryBuilder += format(`WHERE topic = %L `, topic);
    }
    dbQueryBuilder += `GROUP BY articles.article_id
    ORDER BY articles.%I %s;`;
    const dbQuery = format(dbQueryBuilder, sortingParam, sortingOrder);
    const [topicExists, rows] = await Promise.all([
      topicExistsPromise,
      selectArticles(dbQuery),
    ]);
    if (topicExists === 404) {
      return Promise.reject({ status: 404, params: { topic: topic } });
    }
    res.status(200).send({ articles: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = getArticles;
