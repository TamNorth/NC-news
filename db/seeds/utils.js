const db = require("../../db/connection");

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
