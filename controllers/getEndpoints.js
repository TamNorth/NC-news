const { readFile } = require("fs");

const getEndpoints = async (req, res) => {
  return readFile("./endpoints.json", "utf8", async (err, data) => {
    try {
      const endpoints = JSON.parse(data);
      res.status(200).send({ endpoints });
    } catch {
      if (err) throw err;
    }
  });
};

module.exports = getEndpoints;
