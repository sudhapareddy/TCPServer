const mongoose = require("mongoose");

//const mongoURI = "mongodb://localhost:27017/milkDB"; // Change to your database name

// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

require("dotenv").config();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});

module.exports = { mongoose, db };
