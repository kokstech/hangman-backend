import * as dotenv from "dotenv";
dotenv.config();
const express = require("express");
const {
  movieArr,
  addMovie,
  getMovies,
  login,
  addNewUser,
} = require("./hangman");
const validationMiddleware = require("./middleware/validationMiddleware");
const { body } = require("express-validator");
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
  res.json(movieArr);
});

app.post("/add-movie", body("title").trim(), addMovie);

app.post("/login", [body("username").trim(), body("password").trim()], login);
app.post(
  "/signup",
  [
    body("username", "username must be at least 5 letters long")
      .trim()
      .isLength({ min: 5 }),
    body(
      "password",
      "password is requiring: minLength: 7, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1"
    )
      .trim()
      .isStrongPassword({ min: 7 }),
  ],
  validationMiddleware,
  addNewUser
);

function rerun(req, res, next) {
  if (movieArr.length === 0) {
    getMovies();
    next();
  } else {
    next();
  }
}

app.listen(process.env.PORT, () => {
  console.log(`default port is ${process.env.PORT}!!!!`);
});
