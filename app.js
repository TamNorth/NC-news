const db = require("./db/connection.js");
const express = require("express");
const { readFile } = require("fs");
const app = express();

app.get("/api", (req, res) => {
  return readFile("./endpoints.json", "utf8", async (err, data) => {
    try {
      const endpoints = JSON.parse(await data);
      res.status(200).send({ endpoints });
    } catch {
      if (err) throw err;
    }
  });
});

app.get("/api/topics", (req, res) => {
  return db
    .query(`SELECT * FROM topics`)
    .then(({ rows }) => {
      res.status(200).send({ topics: rows });
    })
    .catch((err) => console.log(err));
});

app.get("/api/articles", (req, res) => {
  return db
    .query(
      `SELECT * FROM articles; SELECT article_id, COUNT(comment_id) FROM comments GROUP BY (article_id)`
    )
    .then(([{ rows: articles }, { rows: commentCount }]) => {
      const commentCountLookup = {};
      for (let article of commentCount) {
        commentCountLookup[article.article_id] = article.count;
      }
      articles.forEach((article) => {
        delete article.body;
        const articleId = article.article_id;
        article.comment_count = +commentCountLookup[articleId] || 0;
      });
      articles.sort((a, b) => {
        return Number(b.created_at) - Number(a.created_at);
      });
      res.status(200).send({ articles: articles });
    })
    .catch((err) => console.log(err));
});

module.exports = app;
