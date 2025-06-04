const db = require("./db/connection.js");
const express = require("express");
const { readFile } = require("fs");
const app = express();

const { getArticlesInfo } = require("./controllers");

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

app.get("/api/articles", (req, res) => getArticlesInfo(req, res));

module.exports = app;
