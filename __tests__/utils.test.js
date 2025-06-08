const {
  convertTimestampToDate,
  prepareDataForPgFormat,
  writeInsertStrings,
} = require("../db/seeds/utils");
const {
  deepCopyTable,
  checkRowExists,
  checkArticleExists,
  checkCommentExists,
  checkTopicExists,
} = require("../utils");
const db = require("../db/connection");
const data = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeAll(() => seed(data));
afterAll(() => db.end());

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

describe("writeInsertStrings", () => {
  const input = {
    topics: [
      {
        description: "test description 1",
        slug: "testslug1",
        img_url: "testimgurl1",
      },
      {
        description: "test description 2",
        slug: "testslug2",
        img_url: "testimgurl2",
      },
    ],
    users: [
      {
        username: "testusrname1",
        name: "testname1",
        avatar_url: "testavatarurl1",
      },
      {
        username: "testusrname2",
        name: "testname2",
        avatar_url: "testavatarurl2",
      },
    ],
    articles: [
      {
        created_at: "testtimestamp1",
        title: "testtitle1",
        topic: "testtopic1",
        author: "testauthor1",
        body: "testbody1",
        votes: 1,
        article_img_url: "testarticleurl1",
      },
      {
        created_at: "testtimestamp2",
        title: "testtitle2",
        topic: "testtopic2",
        author: "testauthor2",
        body: "testbody2",
        votes: 2,
        article_img_url: "testarticleurl2",
      },
    ],
  };
  test("inserts into a table named according to keys of each dataset", () => {
    const output = writeInsertStrings(input);
    const slice1 = output.slice(0, 18);
    const expected1 = "INSERT INTO topics";
    const indexOfSlice2 = output.indexOf(";");
    const slice2 = output.slice(indexOfSlice2 + 2, indexOfSlice2 + 19);
    const expected2 = "INSERT INTO users";
    expect(slice1).toBe(expected1);
    expect(slice2).toBe(expected2);
  });
  test("selects the correct column titles from the dataset", () => {
    const output = writeInsertStrings(input);
    const sliceSearchTerm = "articles ";
    const indexOfSlice = output.indexOf(sliceSearchTerm);
    const expected =
      "(created_at, title, topic, author, body, votes, article_img_url)";
    const slice = output.slice(
      indexOfSlice + sliceSearchTerm.length,
      indexOfSlice + sliceSearchTerm.length + expected.length
    );
    expect(slice).toBe(expected);
  });
  test("inserts data values in same order as column titles", () => {
    const output = writeInsertStrings(input);
    const sliceSearchTerm = "VALUES ";
    const indexOfSlice = output.indexOf(sliceSearchTerm);
    const expected =
      "('test description 1', 'testslug1', 'testimgurl1'), ('test description 2', 'testslug2', 'testimgurl2')";
    const slice = output.slice(
      indexOfSlice + sliceSearchTerm.length,
      indexOfSlice + sliceSearchTerm.length + expected.length
    );
    expect(slice).toBe(expected);
  });
});

describe("deepCopyTable", () => {
  const input = [
    {
      property1: "string1",
      property2: 1,
    },
    {
      property1: "string2",
      property2: 2,
    },
    {
      property1: "string3",
      property2: 3,
    },
  ];
  const inputCopy = [
    {
      property1: "string1",
      property2: 1,
    },
    {
      property1: "string2",
      property2: 2,
    },
    {
      property1: "string3",
      property2: 3,
    },
  ];
  const actual = deepCopyTable(input);
  test("returns an identical copy of an array of objects", () => {
    expect(actual).toEqual(actual);
  });
  test("returns a new array", () => {
    expect(actual).not.toBe(input);
  });
  test("returns new objects", () => {
    actual.forEach((item) => {
      expect(item).not.toBe(input[0]);
      expect(item).not.toBe(input[1]);
      expect(item).not.toBe(input[2]);
    });
  });
  test("does not mutate the input", () => {
    expect(input).toEqual(inputCopy);
  });
});

describe("checkRowExists", () => {
  test("resolves to 400 if the row primary key is not provided in the correct format", () => {
    return checkRowExists("articles", "notanumber").then((result) => {
      expect(result).toBe(400);
    });
  });

  test("otherwise resolves 404 if the row does not exist", () => {
    return checkRowExists("articles", 10000).then((result) => {
      expect(result).toBe(404);
    });
  });

  test("resolves to 200 if the row exists", () => {
    return checkRowExists("articles", 1).then((result) => {
      expect(result).toBe(200);
    });
  });
});

describe("checkArticleExists", () => {
  test("resolves to 400 if the article id is not provided as an integer", () => {
    return checkArticleExists("notanumber").then((result) => {
      expect(result).toBe(400);
    });
  });

  test("otherwise resolves 404 if the article does not exist", () => {
    return checkArticleExists(10000).then((result) => {
      expect(result).toBe(404);
    });
  });

  test("resolves to 200 if the article exists", () => {
    return checkArticleExists(1).then((result) => {
      expect(result).toBe(200);
    });
  });
});

describe("checkCommentExists", () => {
  test("resolves to 400 if the comment id is not provided as an integer", () => {
    return checkCommentExists("notanumber").then((result) => {
      expect(result).toBe(400);
    });
  });

  test("otherwise resolves 404 if the comment does not exist", () => {
    return checkCommentExists(10000).then((result) => {
      expect(result).toBe(404);
    });
  });

  test("resolves to 200 if the comment exists", () => {
    return checkCommentExists(1).then((result) => {
      expect(result).toBe(200);
    });
  });
});

describe("checkTopicExists", () => {
  test("otherwise resolves 404 if the topic does not exist", () => {
    return checkTopicExists("fakeTopic").then((result) => {
      expect(result).toBe(404);
    });
  });

  test("resolves to 200 if the topic exists", () => {
    return checkTopicExists("cats").then((result) => {
      expect(result).toBe(200);
    });
  });
});
