const express = require("express");
const app = express();
const {
  getEndpoints,
  getTopics,
  getArticles,
  getUsers,
  getArticleById,
  getCommentsByArticle,
} = require("./controllers");
const {
  handleBadRequest,
  handleCustomErrors,
  handleOtherErrors,
} = require("./error-handlers");

app.get("/api", (req, res) => getEndpoints(req, res));

app.get("/api/topics", (req, res) => getTopics(req, res));

app.get("/api/articles", (req, res, next) => getArticles(req, res, next));

app.get("/api/users", (req, res) => getUsers(req, res));

app.get("/api/articles/:article_id", (req, res, next) =>
  getArticleById(req, res, next)
);

app.get("/api/articles/:article_id/comments", (req, res, next) =>
  getCommentsByArticle(req, res, next)
);

app.use((err, req, res, next) => handleBadRequest(err, req, res, next));

app.use((err, req, res, next) => handleCustomErrors(err, req, res, next));

// app.use((err, req, res, next) => handleOtherErrors(err, req, res, next));

module.exports = app;
