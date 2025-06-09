const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handleDatabaseErrors = (err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "23503" ||
    err.code === "23502" ||
    err.code === "23505"
  ) {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
};

const handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = {
  handleCustomErrors,
  handleDatabaseErrors,
  handleServerErrors,
};
