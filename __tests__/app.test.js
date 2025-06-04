const endpointsJson = require("../endpoints.json");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app.js");
const { makeQuery } = require("../db/seeds/utils.js");
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object with the key of topics, and a value of all topic objects with their slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).not.toHaveLength(0);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles", () => {
  describe("200: Responds with an object containing an array of all articles", () => {
    test("Responds with status code 200 and a non-empty array on the key of articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).not.toHaveLength(0);
        });
    });
    test("Each article object contains all the articles columns, minus the body and plus a comment count", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            const {
              article_id,
              author,
              title,
              topic,
              created_at,
              votes,
              article_img_url,
              comment_count,
            } = article;
            expect(typeof article_id).toBe("number");
            expect(typeof author).toBe("string");
            expect(typeof title).toBe("string");
            expect(typeof topic).toBe("string");
            expect(typeof created_at).toBe("string");
            expect(typeof votes).toBe("number");
            expect(typeof article_img_url).toBe("string");
            expect(typeof comment_count).toBe("number");
          });
        });
    });
    test("Articles are ordered by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body: { articles } }) => {
          // console.log(articles);
          for (let i = 1; i < articles.length; i++) {
            const currentArticleDate = Number(
              articles[i].created_at.split(/[\-T:\.Z]/).join("")
            );
            const previousArticleDate = Number(
              articles[i - 1].created_at.split(/[\-T:\.Z]/).join("")
            );
            expect(previousArticleDate >= currentArticleDate).toBe(true);
          }
        });
    });
  });
});
