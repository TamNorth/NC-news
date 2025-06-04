const db = require("./db/connection.js");
const express = require("express");
const app = express();

const { getEndpoints, getTopics, getArticlesInfo } = require("./controllers");

app.get("/api", (req, res) => getEndpoints(req, res));

app.get("/api/topics", (req, res) => getTopics(req, res));

app.get("/api/articles", (req, res) => getArticlesInfo(req, res));

module.exports = app;
