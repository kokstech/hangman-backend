import * as dotenv from "dotenv";
dotenv.config();
const express = require("express");
const { movieArr, addMovie, run, login, addNewUser } = require("./moviedb");
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200);
  res.send("hello from backend");
});

app.get("/api", rerun, (req, res) => {
  res.status(200);
  res.json(movieArr)
  res.send("movies are awesome")
});

app.post("/add", (req, res) => {
  addMovie(req.body.title);
  res.end(`you add movie ${req.body.title}`);
});

app.post("/login", login);
app.post("/signup", addNewUser);

function rerun(req, res, next) {
  if (movieArr.length === 0) {
    run();
    next();
  } else {
    next();
  }
}

app.listen(process.env.PORT, () => {
  console.log(`default port is ${process.env.PORT}!!!!`);
});
