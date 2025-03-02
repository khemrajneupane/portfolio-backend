const loginRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../utils/config");

loginRouter.post("/", async (request, response) => {
  const user = await User.findOne({ username: request.body.username });

  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(request.body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    response.status(400).send({ error: "username or password incorrect" });
    return;
  }

  const userForToken = {
    username: user.name,
    id: user._id
  };

  const token = jwt.sign(userForToken, config.SECRET);
  console.log("this is token from login.js", token);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
