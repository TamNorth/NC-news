const express = require("express");
const app = express();
const {
  getEndpoints,
  getTopics,
  getArticlesInfo,
  getUsers,
} = require("./controllers");

app.get("/api", (req, res) => getEndpoints(req, res));

app.get("/api/topics", (req, res) => getTopics(req, res));

app.get("/api/articles", (req, res) => getArticlesInfo(req, res));

app.get("/api/users", (req, res) => getUsers(req, res));

module.exports = app;
