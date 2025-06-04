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

module.exports = app;
