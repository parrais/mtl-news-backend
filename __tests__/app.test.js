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
  test("200: Responds with an HTML page detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then((returned) => {
        expect(returned.header["content-type"]).toContain("text/html");
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
  test("200: Accepts a sort_by query which responds with sorted results on comment_count, ordered descending", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0].article_id).toBe(1);
        expect(articles[0].comment_count).toBe(11);
        expect(articles[12].comment_count).toBe(0);
      });
  });
  test("200: Accepts a sort_by query which responds with sorted results on comment_count, ordered ascending", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0].comment_count).toBe(0);
        expect(articles[12].article_id).toBe(1);
        expect(articles[12].comment_count).toBe(11);
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
          comment_count,
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
        expect(typeof comment_count).toBe("number");
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
        expect(body.msg).toBe("No article found for article_id: 456");
      });
  });
  test("200: Responds with an empty array when no comments found for an article that is in the database", () => {
    return request(app)
      .get("/api/articles/11/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(0);
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
  test("404: Responds with an error when passed an article ID not found in the database", () => {
    return request(app)
      .post("/api/articles/456/comments")
      .send({
        author: "icellusedkars",
        body: "This is a new test comment.",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input: Unable to find matching record");
      });
  });
  test("404: Responds with an error when passed a user not found in the database", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        author: "notvalid",
        body: "This is a new test comment.",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input: Unable to find matching record");
      });
  });
  test("400: Responds with an error when passed an invalid user", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        author: ["array"],
        body: "This is a new test comment.",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed no user", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
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
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed no comment", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        author: "icellusedkars",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed no data", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send()
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH - 200: Updates votes on an article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -200 })
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
        expect(article_id).toBe(1);
        expect(typeof articleBody).toBe("string");
        expect(typeof topic).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(votes).toBe(-100);
        expect(typeof article_img_url).toBe("string");
      });
  });
  test("404: Responds with an error when passed an article ID not found in the database", () => {
    return request(app)
      .patch("/api/articles/456")
      .send({ inc_votes: 100 })
      .expect(404)
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
  test("200: Responds with an unchanged article when passed input without an inc_votes key", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ votes: "100" })
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
        expect(article_id).toBe(1);
        expect(typeof articleBody).toBe("string");
        expect(typeof topic).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(votes).toBe(100);
        expect(typeof article_img_url).toBe("string");
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
  test("404: Responds with error when passed a non-existent comment ID", () => {
    return request(app)
      .delete("/api/comments/9090")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Invalid input: no comment to delete with comment_id: 9090"
        );
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("PATCH - 201: Updates votes on a comment", () => {
    return request(app)
      .patch("/api/comments/4")
      .send({ inc_votes: 200 })
      .expect(201)
      .then(({ body }) => {
        const { comment_id, article_id, votes, author, created_at } =
          body.comment;
        const commentBody = body.comment.body;
        expect(comment_id).toBe(4);
        expect(typeof article_id).toBe("number");
        expect(typeof commentBody).toBe("string");
        expect(votes).toBe(100);
        expect(typeof author).toBe("string");
        expect(typeof created_at).toBe("string");
      });
  });
  test("400: Responds with an error when passed a comment ID not found in the database", () => {
    return request(app)
      .patch("/api/comments/456")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("No comment found for comment_id: 456");
      });
  });
  test("400: Responds with an error when passed an invalid comment ID", () => {
    return request(app)
      .patch("/api/comments/nothere")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed an invalid vote total", () => {
    return request(app)
      .patch("/api/comments/4")
      .send({ inc_votes: "ballots" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed input without an inc_votes key", () => {
    return request(app)
      .patch("/api/comments/4")
      .send({ votes: "100" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input: no votes received");
      });
  });
});

describe("POST /api/articles", () => {
  test("POST - 201: Posts a new article", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "This is a new test article.",
        body: "This article has no purpose other than to carry out a test.",
        topic: "cats",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
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
          comment_count,
        } = body.newArticle;
        const articleBody = body.newArticle.body;
        expect(author).toBe("icellusedkars");
        expect(title).toBe("This is a new test article.");
        expect(typeof article_id).toBe("number");
        expect(articleBody).toBe(
          "This article has no purpose other than to carry out a test."
        );
        expect(topic).toBe("cats");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(article_img_url).toBe(
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg"
        );
        expect(typeof comment_count).toBe("number");
      });
  });
  test("400: Responds with an error when passed a user not found in the database", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "notvalid",
        title: "This is a new test article.",
        body: "This article has no purpose other than to carry out a test.",
        topic: "cats",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input: Unable to find matching record");
      });
  });
  test("400: Responds with an error when passed a blank user", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "",
        title: "This is a new test article.",
        body: "This article has no purpose other than to carry out a test.",
        topic: "cats",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed an invalid user", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: 5,
        title: "This is a new test article.",
        body: "This article has no purpose other than to carry out a test.",
        topic: "cats",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed no user", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "This is a new test article.",
        body: "This article has no purpose other than to carry out a test.",
        topic: "cats",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed a blank title", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "",
        body: "This article has no purpose other than to carry out a test.",
        topic: "cats",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed an invalid title", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: 5,
        body: "This article has no purpose other than to carry out a test.",
        topic: "cats",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed no title", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        body: "This article has no purpose other than to carry out a test.",
        topic: "cats",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed a blank body", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "This is a new test article.",
        body: "",
        topic: "cats",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed an invalid body", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "This is a new test article.",
        body: 5,
        topic: "cats",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed no body", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "This is a new test article.",
        topic: "cats",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed a topic not found in the database", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "This is a new test article.",
        body: "This article has no purpose other than to carry out a test.",
        topic: "fish",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input: Unable to find matching record");
      });
  });
  test("400: Responds with an error when passed a blank topic", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "This is a new test article.",
        body: "This article has no purpose other than to carry out a test.",
        topic: "",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed an invalid topic", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "This is a new test article.",
        body: "This article has no purpose other than to carry out a test.",
        topic: 5,
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed no topic", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "This is a new test article.",
        body: "This article has no purpose other than to carry out a test.",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Breaking-news-.jpg",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error when passed no data", () => {
    return request(app)
      .post("/api/articles")
      .send()
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("POST - 201: Posts a new article with a default image when field blank", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "This is a new test article.",
        body: "This article has no purpose other than to carry out a test.",
        topic: "cats",
        article_img_url: "",
      })
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
        } = body.newArticle;
        const articleBody = body.newArticle.body;
        expect(author).toBe("icellusedkars");
        expect(title).toBe("This is a new test article.");
        expect(typeof article_id).toBe("number");
        expect(articleBody).toBe(
          "This article has no purpose other than to carry out a test."
        );
        expect(topic).toBe("cats");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(article_img_url).toBe(
          "https://upload.wikimedia.org/wikipedia/commons/1/1d/Breaking_News-Alert.png"
        );
      });
  });

  test("POST - 201: Posts a new article with a default image when field not present", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "This is a new test article.",
        body: "This article has no purpose other than to carry out a test.",
        topic: "cats",
      })
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
        } = body.newArticle;
        const articleBody = body.newArticle.body;
        expect(author).toBe("icellusedkars");
        expect(title).toBe("This is a new test article.");
        expect(typeof article_id).toBe("number");
        expect(articleBody).toBe(
          "This article has no purpose other than to carry out a test."
        );
        expect(topic).toBe("cats");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(article_img_url).toBe(
          "https://upload.wikimedia.org/wikipedia/commons/1/1d/Breaking_News-Alert.png"
        );
      });
  });
  test("POST - 201: Posts a new article with a default image when field invalid", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "This is a new test article.",
        body: "This article has no purpose other than to carry out a test.",
        topic: "cats",
        article_img_url: 5,
      })
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
        } = body.newArticle;
        const articleBody = body.newArticle.body;
        expect(author).toBe("icellusedkars");
        expect(title).toBe("This is a new test article.");
        expect(typeof article_id).toBe("number");
        expect(articleBody).toBe(
          "This article has no purpose other than to carry out a test."
        );
        expect(topic).toBe("cats");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(article_img_url).toBe(
          "https://upload.wikimedia.org/wikipedia/commons/1/1d/Breaking_News-Alert.png"
        );
      });
  });
});
describe("POST /api/topics", () => {
  test("POST - 201: Adds a new topic", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "NewTopic",
        description: "New description",
      })
      .expect(201)
      .then(({ body }) => {
        const { slug, description } = body.topic;
        expect(slug).toBe("NewTopic");
        expect(description).toBe("New description");
      });
  });
  test("POST - 400: Fails to add a new topic when the topic already exists", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "cats",
        description: "New description",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("POST - 400: Fails to add a new topic when the topic is blank", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "",
        description: "New description",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("POST - 400: Fails to add a new topic when the topic field is missing", () => {
    return request(app)
      .post("/api/topics")
      .send({
        description: "New description",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("POST - 400: Fails to add a new topic when the description is blank", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "cats",
        description: "",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("POST - 400: Fails to add a new topic when the description is missing", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "cats",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("POST - 400: Fails to add a new topic when new object passed", () => {
    return request(app)
      .post("/api/topics")
      .send()
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});
