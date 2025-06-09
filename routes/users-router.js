const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/users.controllers.js");

usersRouter.get("/", getUsers);

usersRouter.get("/:id", (req, res) => {
  res.status(200).send("All OK from /api/users/:id");
});

module.exports = usersRouter;
