const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

const url = process.env.DATABASE_URL;
const client = new MongoClient(url, { useNewUrlParser: true });

const database = client.db("hangman");
const movieCollection = database.collection("movies");
const userCollection = database.collection("users");

const movieArr = [];

async function run() {
  try {
    await client.connect();

    const findResult = await movieCollection.find({}).toArray();
    findResult.forEach((element) =>
      movieArr.push({ title: element.title.toLowerCase() })
    );
    console.log(movieArr);
  } catch (error) {
    console.error(error);
  }
}

async function addMovie(mv) {
  try {
    await client.connect();
    movieCollection.insertOne({ title: mv });
  } catch (error) {
    console.error(error);
  }
}

async function login(req, res) {
  try {
    await client.connect();
    const user = await userCollection.findOne({ username: req.body.username });

    if (!user) {
      res.status(400);
      res.send("Invalid username");
      return;
    }

    const isValid = bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      res.status(400);
      res.send("Invalid password");
      return;
    } else {
      res.status(200);
      res.json({ isLogin: true });
    }
  } catch (error) {
    console.error(error);
  }
}

async function addNewUser(req, res) {
  try {
    await client.connect();
    const checkUsername = await userCollection.findOne({
      username: req.body.username,
    });

    if (checkUsername) {
      res.status(400);
      res.send("username is taken");
      return;
    }
    if (req.body.username === null || req.body.password === null) {
      res.status(400);
      res.send("you cannot leave fields empty");
      return;
    }
    if (req.body.username === "" || req.body.password === "") {
      res.status(400);
      res.send("you cannot leave fields empty");
      return;
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = await userCollection.insertOne({
      username: req.body.username,
      password: hashedPassword,
    });
    res.status(200);
    res.send("success");
  } catch (error) {
    console.error(error);
  }
}

run();
exports.run = run;
exports.movieArr = movieArr;
exports.addMovie = addMovie;
exports.login = login;
exports.addNewUser = addNewUser;
