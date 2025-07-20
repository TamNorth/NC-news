const express = require("express");
const app = express();
const cors = require("cors");
const {
  getEndpoints,
  getTopics,
  getArticles,
  getUsers,
  getArticleById,
  getCommentsByArticle,
  postCommentOnArticle,
  patchVotesOnArticle,
  removeComment,
} = require("./controllers");
const {
  handleDatabaseErrors,
  handleCustomErrors,
  handleOtherErrors,
} = require("./error-handlers");

app.use(cors());

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) =>
  res.send(
    "Please use the /api endpoint to see a list of available endpoints on this API"
  )
);

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

app.post("/api/articles/:article_id/comments", (req, res, next) =>
  postCommentOnArticle(req, res, next)
);

app.patch("/api/articles/:article_id", (req, res, next) =>
  patchVotesOnArticle(req, res, next)
);

app.delete("/api/comments/:comment_id", (req, res, next) =>
  removeComment(req, res, next)
);

app.use((err, req, res, next) => handleDatabaseErrors(err, req, res, next));

app.use((err, req, res, next) => handleCustomErrors(err, req, res, next));

// app.use((err, req, res, next) => handleOtherErrors(err, req, res, next));

module.exports = app;
