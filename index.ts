import * as dotenv from "dotenv";
dotenv.config();
const express = require("express");
//const cors = require("cors");
const { movieArr, addMovie } = require("./moviedb");
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200);
  res.send("hello from backend");
});

app.get("/api", (req, res) => {
  res.status(200);
  res.json(movieArr);
});

app.post("/add", (req, res) => {
  addMovie(req.body.movie);
  res.end(`you add movie ${req.body.movie}`);
});

app.listen(process.env.PORT, () => {
  console.log(`default port is ${process.env.PORT}!!!!`);
});
