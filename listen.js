const app = require("./app");

const { PORT = 9292 } = process.env;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening on ${PORT}...`);
  }
});
