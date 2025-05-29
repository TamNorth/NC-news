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

exports.writeInsertStrings = (allTablesData) => {
  let queryAccumulator = [];
  for (let tableData in allTablesData) {
    let stringAccumulator = [];
    stringAccumulator.push(`INSERT INTO ${tableData} (`);
    for (let col in allTablesData[tableData][0]) {
      stringAccumulator.push(`${col}`);
      stringAccumulator.push(`, `);
    }
    stringAccumulator.pop();
    stringAccumulator.push(`) VALUES %L; `);
    const pgFormatString = stringAccumulator.join("");
    const pgFormatData = exports.prepareDataForPgFormat(
      allTablesData[tableData]
    );
    queryAccumulator.push(format(pgFormatString, pgFormatData));
  }
  return queryAccumulator.join("");
};
