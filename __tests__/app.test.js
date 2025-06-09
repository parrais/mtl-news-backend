const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
  test("404: Responds with an error when requesting an invalid endpoint under /api", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint not found");
      });
  });
  test("404: Responds with an error when requesting an invalid endpoint outside /api", () => {
    return request(app)
      .get("/invalid")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).not.toBe(0);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});
describe("GET /api/articles", () => {
  test("200: Responds with an array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).not.toBe(0);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(article).not.toHaveProperty("body");
        });
        const sortedDescendingArticles = articles.toSorted((a, b) => {
          dateA = new Date(a.created_at);
          dateB = new Date(b.created_at);
          return dateB - dateA;
        });
        expect(articles).toEqual(sortedDescendingArticles);
      });
  });
  test("200: Accepts a topic query which responds with only articles of that topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("404: Responds with an error message if the topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=notmitch")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic does not exist");
      });
  });
  test("200: Returns no results for a valid topic query where topic has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(0);
      });
  });
  test("200: Accepts a sort_by query which responds with sorted results on string field", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0].title).toBe("Z");
        expect(articles[12].title).toBe("A");
      });
  });
  test("200: Accepts a sort_by query which responds with sorted results on string field, ordered descending", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0].title).toBe("Z");
        expect(articles[12].title).toBe("A");
      });
  });
  test("200: Accepts a sort_by query which responds with sorted results on string field, ordered ascending", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0].title).toBe("A");
        expect(articles[12].title).toBe("Z");
      });
  });
  test("200: Accepts a sort_by query which responds with sorted results on numeric field", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0].article_id).toBe(13);
        expect(articles[12].article_id).toBe(1);
      });
  });
  test("200: Accepts a sort_by query which responds with sorted results on numeric field, ordered descending", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0].article_id).toBe(13);
        expect(articles[12].article_id).toBe(1);
      });
  });
  test("200: Accepts a sort_by query which responds with sorted results on numeric field, ordered ascending", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0].article_id).toBe(1);
        expect(articles[12].article_id).toBe(13);
      });
  });
  test("200: Accepts a sort_by query which responds with sorted results on numeric field, ordered ascending, with topic", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        expect(articles[0].article_id).toBe(1);
        expect(articles[11].article_id).toBe(13);
      });
  });
  test("400: Responds with an error message if the sorting column does not exist", () => {
    return request(app)
      .get("/api/articles?sort_by=nothere&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("400: Responds with an error message if the order method does not exist", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).not.toBe(0);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
describe("GET /api/users/:username", () => {
  test("200: Responds with a users by their username when valid", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body }) => {
        const { username, avatar_url, name } = body.user;
        expect(username).toBe("rogersop");
        expect(typeof name).toBe("string");
        expect(typeof avatar_url).toBe("string");
      });
  });
  test("404: Responds with an error when passed an unknown username", () => {
    return request(app)
      .get("/api/users/nothere")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user found for username: nothere");
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article by its id when valid", () => {
    return request(app)
      .get("/api/articles/11")
      .expect(200)
      .then(({ body }) => {
        const {
          author,
          title,
          article_id,
          topic,
          created_at,
          votes,
          article_img_url,
        } = body.article;
        const articleBody = body.article.body;
        expect(typeof author).toBe("string");
        expect(typeof title).toBe("string");
        expect(article_id).toBe(11);
        expect(typeof articleBody).toBe("string");
        expect(typeof topic).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof article_img_url).toBe("string");
      });
  });
  test("400: Responds with an error when passed an invalid ID", () => {
    return request(app)
      .get("/api/articles/invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("404: Responds with an error when no article of that ID in the database", () => {
    return request(app)
      .get("/api/articles/456")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found for article_id: 456");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of all comments on an article when supplied an article ID with comments", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).not.toBe(0);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(5);
        });
        const sortedDescendingComments = comments.toSorted((a, b) => {
          dateA = new Date(a.created_at);
          dateB = new Date(b.created_at);
          return dateB - dateA;
        });
        expect(comments).toEqual(sortedDescendingComments);
      });
  });
  test("400: Responds with an error when passed an invalid article ID", () => {
    return request(app)
      .get("/api/articles/invalid/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("404: Responds with an error when no article of that ID in the database", () => {
    return request(app)
      .get("/api/articles/456/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "No article or comments found for article_id: 456"
        );
      });
  });
  test("404: Responds with an error when no comments found for an article that is in the database", () => {
    return request(app)
      .get("/api/articles/11/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "No article or comments found for article_id: 11"
        );
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST - 201: Posts a new comment to an article", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        author: "icellusedkars",
        body: "This is a new test comment.",
      })
      .expect(201)
      .then(({ body }) => {
        const { comment_id, votes, created_at, author, article_id } =
          body.newComment;
        const commentBody = body.newComment.body;
        expect(typeof comment_id).toBe("number");
        expect(typeof votes).toBe("number");
        expect(typeof created_at).toBe("string");
        expect(author).toBe("icellusedkars");
        expect(commentBody).toBe("This is a new test comment.");
        expect(article_id).toBe(5);
      });
  });
  test("400: Responds with an error when passed an invalid article ID", () => {
    return request(app)
      .post("/api/articles/invalid/comments")
      .send({
        author: "icellusedkars",
        body: "This is a new test comment.",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed an article ID not found in the database", () => {
    return request(app)
      .post("/api/articles/456/comments")
      .send({
        author: "icellusedkars",
        body: "This is a new test comment.",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed a user not found in the database", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        author: "notvalid",
        body: "This is a new test comment.",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed a blank comment", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        author: "icellusedkars",
        body: "",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input: comment must not be blank");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH - 201: Updates votes on an article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -200 })
      .expect(201)
      .then(({ body }) => {
        const {
          author,
          title,
          article_id,
          topic,
          created_at,
          votes,
          article_img_url,
        } = body.article;
        const articleBody = body.article.body;
        expect(typeof author).toBe("string");
        expect(typeof title).toBe("string");
        expect(article_id).toBe(1);
        expect(typeof articleBody).toBe("string");
        expect(typeof topic).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(votes).toBe(-100);
        expect(typeof article_img_url).toBe("string");
      });
  });
  test("400: Responds with an error when passed an article ID not found in the database", () => {
    return request(app)
      .patch("/api/articles/456")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found for article_id: 456");
      });
  });
  test("400: Responds with an error when passed an invalid article ID", () => {
    return request(app)
      .patch("/api/articles/nothere")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed an invalid vote total", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "ballots" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed input without an inc_votes key", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ votes: "100" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input: no votes received");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with no content when deleting a comment", () => {
    return request(app).delete("/api/comments/14").expect(204);
  });
  test("400: Responds with error when passed a bad comment ID", () => {
    return request(app)
      .delete("/api/comments/notvalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with error when passed a non-existent comment ID", () => {
    return request(app)
      .delete("/api/comments/9090")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Invalid input: no comment to delete with comment_id: 9090"
        );
      });
  });
});
