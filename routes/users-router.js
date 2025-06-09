const usersRouter = require("express").Router();
const { getUser, getUsers } = require("../controllers/users.controllers.js");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUser);

module.exports = usersRouter;
