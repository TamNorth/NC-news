const db = require("../../db/connection");
const format = require("pg-format");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.prepareDataForPgFormat = (data) => {
  return data.map((row) => {
    let formattedRow = [];
    for (let col in row) {
      formattedRow.push(row[col]);
    }
    return formattedRow;
  });
};

exports.writeInsertStrings = (dataSets) => {
  let queryAccumulator = [];
  for (let dataSet in dataSets) {
    let stringAccumulator = [];
    stringAccumulator.push(`INSERT INTO ${dataSet} (`);
    for (let col in dataSets[dataSet][0]) {
      stringAccumulator.push(`${col}`);
      stringAccumulator.push(`, `);
    }
    stringAccumulator.pop();
    stringAccumulator.push(`) VALUES %L; `);
    const pgFormatString = stringAccumulator.join("");
    const pgFormatData = exports.prepareDataForPgFormat(dataSets[dataSet]);
    queryAccumulator.push(format(pgFormatString, pgFormatData));
  }
  return queryAccumulator.join("");
};
