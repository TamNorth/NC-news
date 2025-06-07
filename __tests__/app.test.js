const endpointsJson = require("../endpoints.json");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app.js");
const { makeQuery } = require("../db/seeds/utils.js");
const { checkArticleExists } = require("../utils.js");
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
          expect(message).toBe("Bad request: article_id must be an integer");
        });
    });
    test("404: When specified :article_id does not exist, responds with an error message", () => {
      return request(app)
        .get("/api/articles/10000")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Not found: nothing at article_id: 10000");
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
          expect(message).toBe("Bad request: article_id must be an integer");
        });
    });

    test("404: When specified :article_id does not exist, responds with an error message", () => {
      return request(app)
        .get("/api/articles/10000/comments")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Not found: nothing at article_id: 10000");
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

describe("POST /api/articles/:article_id/comments", () => {
  const testUsername = "lurker";
  const testCommentBody = "This is a test comment";
  const articleId = 6;
  describe("201:", () => {
    test("posts a new comment to the specified article", () => {
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send({
          username: testUsername,
          body: testCommentBody,
        })
        .then(() => {
          return db.query(
            "SELECT * FROM comments WHERE author = $1 AND body = $2;",
            [testUsername, testCommentBody]
          );
        })
        .then(({ rows: [comment] }) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("object");
          expect(comment.author).toBe(testUsername);
          expect(comment.body).toBe(testCommentBody);
          expect(comment.article_id).toBe(articleId);
        });
    });

    test("responds with the posted article", () => {
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send({
          username: testUsername,
          body: testCommentBody,
        })
        .expect(201)
        .then(({ body: response }) => {
          expect(typeof response.comment_id).toBe("number");
          expect(typeof response.votes).toBe("number");
          expect(typeof response.created_at).toBe("string");
          expect(typeof response.author).toBe("string");
          expect(typeof response.body).toBe("string");
          expect(typeof response.article_id).toBe("number");
        });
    });
  });
  test("400: when :article_id is not a number, responds with an error message", () => {
    return request(app)
      .post("/api/articles/notanumber/comments")
      .send({
        username: testUsername,
        body: testCommentBody,
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request: article_id must be an integer");
      });
  });

  test("404: when :article_id does not exist, responds with an error message", () => {
    return request(app)
      .post("/api/articles/10000/comments")
      .send({
        username: testUsername,
        body: testCommentBody,
      })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not found");
      });
  });
  test("404: when username does not match an existing username, responds with an error", () => {
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send({
        username: "doesn't go here",
        body: testCommentBody,
      })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not found");
      });
  });
  test("400: when body is not a string, responds with an error", () => {
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send({
        username: testUsername,
        body: [487923],
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request: comment body must be a string");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  describe("200:", () => {
    test("increments the vote count on the article by the given amount", () => {
      const articleId = 6;
      let initialVotes = 0;
      const votesToAdd = 12;
      return db
        .query(`SELECT votes FROM articles WHERE article_id = $1;`, [articleId])
        .then(({ rows: [{ votes }] }) => {
          initialVotes = votes;
          return request(app)
            .patch(`/api/articles/${articleId}`)
            .send({ inc_votes: votesToAdd });
        })
        .then(() => {
          return db.query(
            `SELECT votes 
              FROM articles 
              WHERE article_id = $1;`,
            [articleId]
          );
        })
        .then(({ rows: [{ votes }] }) => {
          expect(votes).toBe(initialVotes + votesToAdd);
        });
    });

    test("works for negative vote amounts", () => {
      const articleId = 6;
      let initialVotes = 0;
      const votesToAdd = -3;
      return db
        .query(`SELECT votes FROM articles WHERE article_id = $1;`, [articleId])
        .then(({ rows: [{ votes }] }) => {
          initialVotes = votes;
          return request(app)
            .patch(`/api/articles/${articleId}`)
            .send({ inc_votes: votesToAdd });
        })
        .then(() => {
          return db.query(
            `SELECT votes 
              FROM articles 
              WHERE article_id = $1;`,
            [articleId]
          );
        })
        .then(({ rows: [{ votes }] }) => {
          expect(votes).toBe(initialVotes + votesToAdd);
        });
    });

    test("responds with 200 and the updated article", () => {
      const articleId = 6;
      const votesToAdd = 12;
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send({ inc_votes: votesToAdd })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.article_id).toBe(articleId);
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.body).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
        });
    });
  });

  describe("error handling", () => {
    test("400: When :article_id is not a number, responds with an error message", () => {
      const articleId = "notanumber";
      const votesToAdd = 12;
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send({ inc_votes: votesToAdd })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request: article_id must be an integer");
        });
    });

    test("404: When specified :article_id does not exist, responds with an error message", () => {
      const articleId = 10000;
      const votesToAdd = 12;
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send({ inc_votes: votesToAdd })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Not found: nothing at article_id: 10000");
        });
    });

    test("400: When an integer number of votes is not supplied, does not modify the article and responds with an error message", () => {
      const articleId = 6;
      let initialVotes = 0;
      const votesToAdd = 12.5;
      return db
        .query(`SELECT votes FROM articles WHERE article_id = $1;`, [articleId])
        .then(({ rows: [{ votes }] }) => {
          initialVotes = votes;
          return request(app)
            .patch(`/api/articles/${articleId}`)
            .send({ inc_votes: votesToAdd })
            .expect(400);
        })
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad request: votes to add must be supplied in the format {inc_votes: <votes>} where <votes> is a number"
          );
          return db.query(
            `SELECT votes 
              FROM articles 
              WHERE article_id = $1;`,
            [articleId]
          );
        })
        .then(({ rows: [{ votes }] }) => {
          expect(votes).toBe(initialVotes);
        });
    });

    test("400: When there is no key of inc_votes, responds with an error message", () => {
      const articleId = 6;
      const votesToAdd = 12;
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send({ anotherKey: votesToAdd })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad request: votes to add must be supplied in the format {inc_votes: <votes>} where <votes> is a number"
          );
        });
    });
  });
});

describe.only("DELETE /api/comments/:comment_id", () => {
  test("204: deletes the specified comment", () => {
    const commentId = 3;
    let initialNumOfComments = 0;
    return db
      .query(`SELECT comment_id FROM comments`)
      .then(({ rows }) => {
        initialNumOfComments = rows.length;
        expect(rows).toContainEqual({ comment_id: commentId });
        return request(app).delete(`/api/comments/${commentId}`).expect(204);
      })
      .then(() => {
        return db.query(`SELECT comment_id FROM comments`);
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(initialNumOfComments - 1);
        expect(rows).not.toContainEqual({ comment_id: commentId });
      });
  });

  test("400: when :comment_id is not a number, responds with an error", () => {
    const commentId = "notanumber";
    return request(app)
      .delete(`/api/comments/${commentId}`)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request: comment_id must be an integer");
      });
  });

  test("404: otherwise, when :comment_id does not exist, responds with an error message", () => {
    const commentId = 10000;
    return request(app)
      .delete(`/api/comments/${commentId}`)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not found: nothing at comment_id: 10000");
      });
  });
});
