# NC News Seeding (MTL Edition)

- This is Matt Lewis's personal repo for the NC News Seeding challenge.
- If using this repo, `.env` files will need to be created locally (and added to `.gitignore`) as follows:

`.env.development`

```
PGDATABASE=nc_news
```

`.env.test`

```
PGDATABASE=nc_news_test
```

## Entity Relationship Diagram

![Entity Relationship Diagram for NC News, including the tables topics, users, articles and comments](nc-news-erd.png)
