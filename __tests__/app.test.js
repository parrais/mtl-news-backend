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
          expect("body" in article).toBe(false);
        });
        const sortedDescendingArticles = articles.toSorted((a, b) => {
          dateA = new Date(a.created_at);
          dateB = new Date(b.created_at);
          return dateB - dateA;
        });
        expect(articles).toEqual(sortedDescendingArticles);
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
});
