const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

/**get http://localhost:3001/api/users */
usersRouter.get("/", async (request, response) => {
  const users = await User.find()
  response.json(users.map(u => u.toJSON()));
});

/**POST http://localhost:3001/api/users/*/
usersRouter.post("/", async (req, res, next) => {
  const body = req.body;
  if (!body.password) {
    res.status(400).json({ error: "password missing" });
  } else if (body.password.length < 3) {
    res.status(400).json({ error: "password must have minimum 3 characters" });
  }
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

    const user = new User({
      username: req.body.username,
      name: req.body.name,
      email:req.body.email,
      passwordHash
    });
    // password: body.password,
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (e) {
    if (e.name === "ValidationError") {
      //console.log(e);
      res.status(400).send(e.message);
    } else {
      next(e);
    }
  }
});

module.exports = usersRouter;
