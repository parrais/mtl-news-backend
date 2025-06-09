const { fetchUser, fetchUsers } = require("../models/users.models.js");

const getUsers = (request, response) => {
  fetchUsers().then((users) => {
    response.status(200).send({ users });
  });
};

const getUser = (request, response, next) => {
  const { username } = request.params;
  fetchUser(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUser, getUsers };
