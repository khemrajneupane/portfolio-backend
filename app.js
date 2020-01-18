const config = require("./utils/config");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const portfolioRouter = require("./controllers/portfolios");
const experienceRouter = require("./controllers/experiences");
const messageRouter = require("./controllers/messages");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
//var device = require("express-device");
const mongoose = require("mongoose");
const middleware = require("./utils/middleware");

console.log("commecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to PORTFOLIO DB");
  })
  .catch(error => {
    console.log("error connection to MongoDB:", error.message);
  });

app.use(cors());
//app.use(device.capture());
app.use(bodyParser.json());
app.use("/api/portfolios", portfolioRouter);
app.use("/api/experiences", experienceRouter);
app.use("/api/messages", messageRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(middleware.tokenExtractor);

module.exports = app;
