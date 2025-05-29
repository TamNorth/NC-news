const {
  convertTimestampToDate,
  prepareDataForPgFormat,
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("prepareDataForPgFormat", () => {
  test("returns a new array", () => {
    const input = [
      { col1: "datum1", col2: 2, col3: "datum3" },
      { col1: "datum4", col2: 5, col3: "datum6" },
      { col1: "datum7", col2: 8, col3: "datum9" },
    ];
    expect(prepareDataForPgFormat(input)).not.toBe(input);
  });
  test("reformats a single datum in a nested object into a nested array", () => {
    const input = [{ col1: "datum1" }];
    const expected = [["datum1"]];
    expect(prepareDataForPgFormat(input)).toEqual(expected);
  });
  test("reformats mutliple data in a single nested object into a nested array", () => {
    const input = [{ col1: "datum1", col2: "datum2", col3: "datum3" }];
    const expected = [["datum1", "datum2", "datum3"]];
    expect(prepareDataForPgFormat(input)).toEqual(expected);
  });
  test("reformats data in multiple nested objects into nested arrays", () => {
    const input = [
      { col1: "datum1", col2: "datum2", col3: "datum3" },
      { col1: "datum4", col2: "datum5", col3: "datum6" },
      { col1: "datum7", col2: "datum8", col3: "datum9" },
    ];
    const expected = [
      ["datum1", "datum2", "datum3"],
      ["datum4", "datum5", "datum6"],
      ["datum7", "datum8", "datum9"],
    ];
    expect(prepareDataForPgFormat(input)).toEqual(expected);
  });
  test("works with numbers and strings", () => {
    const input = [{ col1: "datum1", col2: 2, col3: "datum3" }];
    const expected = [["datum1", 2, "datum3"]];
    expect(prepareDataForPgFormat(input)).toEqual(expected);
  });
  test("does not mutate the input", () => {
    const input = [{ col1: "datum1", col2: 2, col3: "datum3" }];
    const inputCopy = [{ col1: "datum1", col2: 2, col3: "datum3" }];
    prepareDataForPgFormat(input);
    expect(input).toEqual(inputCopy);
  });
});
