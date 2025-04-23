const mongoose = require("mongoose");

//const mongoURI = "mongodb://localhost:27017/milkDB"; // Change to your database name

// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

//require("dotenv").config();

//const mongo_URI = process.env.MONGO_URI;

console.log("MONGO_URI:", mongo_URI);

mongoose.connect(mongo_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});

module.exports = { mongoose, db };
