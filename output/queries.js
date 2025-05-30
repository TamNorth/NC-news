const db = require("../db/connection.js");
const fs = require("fs");

function makeQuery(query, fileName) {
  db.query(query).then((result) => {
    const data = "```js\n" + JSON.stringify(result.rows) + "\n```";
    fs.writeFile(`${__dirname}/${fileName}.md`, data, (error) => {
      if (!!error) {
        console.log(error);
      } else {
        console.log("file write successful");
      }
    });
  });
}

makeQuery("SELECT * FROM users;", "all_users");
makeQuery("SELECT * FROM articles WHERE topic = 'coding'", "coding_articles");
makeQuery("SELECT * FROM comments WHERE votes < 0", "bad_comments");
makeQuery("SELECT slug FROM topics", "all_topics");
makeQuery(
  "SELECT * FROM articles WHERE author = 'grumpy19'",
  "grumpy_articles"
);
makeQuery("SELECT * FROM comments WHERE votes > 10", "good_comments");

db.query("dt");

db.end();
