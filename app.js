const config = require("./utils/config");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const portfolioRouter = require("./controllers/profiles");

const mongoose = require("mongoose");
const middleware = require("./utils/middleware");

console.log("connecting to", config.MONGODB_URI);

mongoose
  .connect(
    config.MONGODB_URI,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch(error => {
    console.log("error connection to MongoDB:", error.message);
  });

app.use(cors());
//app.use(express.static('build'))
app.use(bodyParser.json());

app.use("/api/portfolios", portfolioRouter);

app.use(middleware.tokenExtractor);

module.exports = app;
