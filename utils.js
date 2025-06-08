const db = require("./db/connection.js");
const fs = require("fs");
const format = require("pg-format");

exports.deepCopyTable = (objects) => {
  return objects.map(({ ...properties }) => {
    return { ...properties };
  });
};

exports.appendPropertyByLookup = (
  objects,
  lookupReferenceKey,
  newKey,
  lookup
) => {
  const objectsCopy = exports.deepCopyTable(objects);
  objectsCopy.forEach((object) => {
    const reference = object[lookupReferenceKey];
    object[newKey] = lookup[reference] || 0;
  });
  return objectsCopy;
};

exports.makeQuery = (query, fileName) => {
  db.query(query).then((result) => {
    const data = "```js\n" + JSON.stringify(result.rows) + "\n```";
    fs.writeFile(`${__dirname}/output/${fileName}.md`, data, (error) => {
      if (!!error) {
        console.log(error);
      } else {
        console.log("file write successful");
      }
    });
  });
};

exports.checkRowExists = (table, primaryKeyValue) => {
  const primaryKeyLookup = {
    articles: "article_id",
    comments: "comment_id",
    topics: "slug",
    users: "username",
  };
  const query = format(
    `SELECT COUNT(*) FROM %I WHERE %I = %L;`,
    table,
    primaryKeyLookup[table],
    primaryKeyValue
  );
  return db
    .query(query)
    .then(({ rows: [{ count }] }) => {
      if (+count) {
        return 200;
      } else {
        return 404;
      }
    })
    .catch((err) => {
      if (err.code === "22P02") {
        return 400;
      } else {
        return err;
      }
    });
};

exports.checkArticleExists = (articleId) => {
  return exports.checkRowExists("articles", articleId).catch((err) => {
    throw err;
  });
};

exports.checkCommentExists = (commentId) => {
  return exports.checkRowExists("comments", commentId).catch((err) => {
    throw err;
  });
};

exports.checkTopicExists = (topicSlug) => {
  return exports.checkRowExists("topics", topicSlug).catch((err) => {
    throw err;
  });
};
