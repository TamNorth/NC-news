const db = require("./db/connection.js");
const fs = require("fs");

exports.appendPropertyByLookup = (
  objects,
  lookupReferenceKey,
  newKey,
  lookup
) => {
  objects.forEach((object) => {
    const reference = object[lookupReferenceKey];
    object[newKey] = lookup[reference] || 0;
  });
  return objects;
};

exports.makeQuery = (query, fileName) => {
  db.query(query).then((result) => {
    const data = "```js\n" + JSON.stringify(result.rows) + "\n```";
    fs.writeFile(`${__dirname}/../../output/${fileName}.md`, data, (error) => {
      if (!!error) {
        console.log(error);
      } else {
        console.log("file write successful");
      }
    });
  });
};
