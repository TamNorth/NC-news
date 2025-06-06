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
describe("GET /api/articles{*}", () => {
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

  describe("GET /api/articles/:article_id", () => {
    test("200: Responds with an object with the specified article object on a key of article", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.article_id).toBe(3);
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.body).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
        });
    });
    test("400: When :article_id is not a number, responds with an error message", () => {
      return request(app)
        .get("/api/articles/notanumber")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });
    test("404: When specified :article_id does not exist, responds with an error message", () => {
      return request(app)
        .get("/api/articles/10000")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("No article found for article_id: 10000");
        });
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    test("200: Responds with an object with an array of comments, on a key of comments", () => {
      return request(app)
        .get("/api/articles/6/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).not.toHaveLength(0);
          comments.forEach((comment) => {
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.article_id).toBe("number");
          });
        });
    });

    test("200: When specified :article_id has no comments, responds with an empty array", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });

    test("400: When :article_id is not a number, responds with an error message", () => {
      return request(app)
        .get("/api/articles/notanumber/comments")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });

    test("404: When specified :article_id does not exist, responds with an error message", () => {
      return request(app)
        .get("/api/articles/10000/comments")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("No article found for article_id: 10000");
        });
    });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an object with an array of all user objects on the key of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).not.toHaveLength(0);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
