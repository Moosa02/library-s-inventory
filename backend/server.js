let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");
let bodyParser = require("body-parser");
require('dotenv').config(); // Ensure environment variables are loaded

const mongoDbUrl = process.env.mongoDb_url; // Use correct environment variable name
const bookRoutes = require("./routes/booksRoutes");

console.log(mongoDbUrl)

mongoose
  .connect(mongoDbUrl)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/books", bookRoutes);

// PORT
const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log("Connected to port " + port);
});

// 404 Error
app.use((req, res, next) => {
  res.status(404).send({ message: "Not Found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
