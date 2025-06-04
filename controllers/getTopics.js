const db = require("../db/connection.js");

const getTopics = async (req, res) => {
  return db
    .query(`SELECT * FROM topics`)
    .then(({ rows }) => {
      res.status(200).send({ topics: rows });
    })
    .catch((err) => console.log(err));
};

module.exports = getTopics;
