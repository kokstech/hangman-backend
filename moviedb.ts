const { MongoClient } = require("mongodb");

const url = process.env.DATABASE_URL;
const client = new MongoClient(url, { useNewUrlParser: true });

const database = client.db("hangman");
const collection = database.collection("movies");

const movieArr = [];

async function run() {
  try {
    await client.connect();

    const findResult = await collection.find({}).toArray();
    findResult.forEach((element) =>
      movieArr.push({ title: element.title.toLowerCase() })
    );
    console.log(movieArr);
  } catch (error) {
    console.error(error);
  }
  // finally {
  //   await client.close();
  // }
}

async function addMovie(mv) {
  try {
    await client.connect();
    collection.insertOne({ title: mv });
  } catch (error) {
    console.error(error);
  }
  // finally {
  //   await client.close();
  // }
}

async function login(req, res) {
  try {
    await client.connect();
    const collection = database.collection("users");
    const user = await collection.findOne({ username: req.body.username });
    console.log(user);
    const isValid = user.password === req.body.password;
    if (!isValid) {
      res.status(404);
      res.send("Invalid username or password");
      return;
    } else {
      res.json({ isLogin: true });
    }
  } catch (error) {
    console.error(error);
  }
}

async function addNewUser(req, res) {
  try {
    await client.connect();
    const collection = database.collection("users");
    const user = await collection.insertOne({
      username: req.body.username,
      password: req.body.password,
    });
    console.log(user);
    res.json({ message: `you have added new user ${user.username}` });
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
