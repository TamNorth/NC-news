const db = require("../db/connection.js");

const getUsers = (request, res) => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    res.status(200).send({ users: rows });
  });
};

module.exports = getUsers;
