const db = require("../db/connection.js");
const { makeQuery } = require("../utils.js");

// GET ALL DATA
// makeQuery("SELECT * FROM articles;", "all_articles");
// makeQuery("SELECT * FROM comments;", "all_comments");
// makeQuery("SELECT * FROM topics;", "all_topics");
// makeQuery("SELECT * FROM users;", "all_users");
// makeQuery("SELECT * FROM user_topic;", "all_user_topic");

// TASK QUERIES
// makeQuery("SELECT * FROM articles WHERE topic = 'coding'", "coding_articles");
// makeQuery("SELECT * FROM comments WHERE votes < 0", "bad_comments");
// makeQuery("SELECT slug FROM topics", "all_topics");
// makeQuery(
//   "SELECT * FROM articles WHERE author = 'grumpy19'",
//   "grumpy_articles"
// );
// makeQuery("SELECT * FROM comments WHERE votes > 10", "good_comments");
// makeQuery("SELECT * FROM user_topic", "user_topic_data");

db.end();
