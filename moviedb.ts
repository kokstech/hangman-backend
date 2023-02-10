const { MongoClient } = require("mongodb");

const url = process.env.DATABASE_URL;

const client = new MongoClient(url, { useNewUrlParser: true });

const database = client.db("sample_mflix");
const movies = database.collection("hangmanMovies");

const movieArr = [];

async function run() {
  try {
    const movie = await movies.findOne({ title: "movies" });
    movie.moviearray.forEach((element) =>
      movieArr.push({ title: element.toLowerCase() })
    );

    console.log(movieArr);
  } finally {
    //await client.close();
  }
}

async function addMovie(mv) {
  try {
    const filter = { title: "movies" };
    const updateArr = { $push: { moviearray: mv } };
    const result = await movies.updateOne(filter, updateArr);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
  } finally {
    //await client.close();
  }
}

run();
exports.movieArr = movieArr;
exports.addMovie = addMovie;
