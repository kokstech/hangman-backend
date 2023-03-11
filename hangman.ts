const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const url = process.env.DATABASE_URL;
const client = new MongoClient(url, { useNewUrlParser: true });
const database = client.db("hangman");
const movieCollection = database.collection("movies");
const userCollection = database.collection("users");

interface Movies {
  title: string;
}

const movieArr: Movies[] = [];

async function getMovies() {
  try {
    const findResult = await movieCollection.find({}).toArray();
    findResult.forEach((element: Movies) =>
      movieArr.push({ title: element.title.toLowerCase() })
    );
  } catch (error) {
    console.error(error);
  }
}

async function addMovie(req, res) {
  try {
    if (req.body.title === undefined) {
      return res.status(400).send("please enter valid value");
    }
    movieCollection.insertOne({ title: req.body.title });
    res.status(200).send(`you have added ${req.body.title} to db`);
  } catch (error) {
    console.error(error);
  }
}

async function login(req, res) {
  try {
    const user = await userCollection.findOne({ username: req.body.username });

    if (!user) {
      res.status(400);
      return res.send("Invalid username");
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      res.status(422);
    } else {
      res.status(200);
      res.json({ isLogin: true, user: user.username });
    }
  } catch (error) {
    console.error(error);
  }
}

async function addNewUser(req, res) {
  try {
    const checkUsername = await userCollection.findOne({
      username: req.body.username,
    });

    if (checkUsername) {
      res.status(400);
      return res.send("username is taken");
    }
    if (req.body.username === null || req.body.password === null) {
      res.status(400);
      return res.send("you cannot leave fields empty");
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await userCollection.insertOne({
      username: req.body.username,
      password: hashedPassword,
    });
    res.status(200);
    res.send("success");
  } catch (error) {
    console.error(error);
  }
}

getMovies();
exports.getMovies = getMovies;
exports.movieArr = movieArr;
exports.addMovie = addMovie;
exports.login = login;
exports.addNewUser = addNewUser;
