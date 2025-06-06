const db = require("./db/connection.js");
const fs = require("fs");

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

exports.checkArticleExists = (articleId) => {
  return db
    .query(`SELECT COUNT(*) FROM articles WHERE article_id = $1;`, [articleId])
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
