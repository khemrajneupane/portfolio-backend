const express = require("express");
const messageRouter = express.Router();
const Message = require("../models/message");

const config = require("../utils/config");
const jwt = require("jsonwebtoken");
const tokenExtractor = require("../utils/middleware");
const User = require("../models/user");

/** GET all answers: http://localhost:3001/api/experiences */
messageRouter.get("/", async (req, res) => {
  const messages = await Message.find({});
  res.json(messages.map(p => p.toJSON()));
});

/**POST http://localhost:3001/api/messages/ */

messageRouter.post("/", async (req, res, next) => {
  const body = req.body;
  console.log("hi from message Router");
  if (!body.full_name || !body.email || !body.messages) {
    res.status(400).send("fields are all required");
  }
  try {
    const message = new Message({
      full_name: body.full_name,
      email: body.email,
      messages: body.messages
    });

    const savedMessages = await message.save();

    res.status(201).json(savedMessages.toJSON());
  } catch (e) {
    if (e.name === "CastError") {
      //console.log(e);
      res.status(400).send(`Value for ${e.stringValue} is not correct`);
    } else {
      next(e);
    }
  }
});

/*
messageRouter.post("/", async (req, res, next) => {
  const body = req.body;
  console.log("hi from message Router");
  if (!body.full_name || !body.email || !body.messages) {
    res.status(400).send("fields are all required");
  }
  try {
    const decodedToken = await jwt.verify(
      tokenExtractor.tokenExtractor(req),
      config.SECRET
    );
    console.log("decoded token ", decodedToken);
    if (!tokenExtractor.tokenExtractor(req) || !decodedToken.id) {
      res.status(400).send({ error: "Incorrect username or password" });
      return;
    }
    const user = await User.findById(decodedToken.id);
    const message = new Message({
      full_name: body.full_name,
      email: body.email,
      messages: body.messages,
      user: user._id
    });

    const savedMessages = await message.save();
    user.messages = user.messages.concat(savedMessages._id);
    await user.save();
    res.status(201).json(savedMessages.toJSON());
  } catch (e) {
    if (e.name === "CastError") {
      //console.log(e);
      res.status(400).send(`Value for ${e.stringValue} is not correct`);
    } else {
      next(e);
    }
  }
});
*/

module.exports = messageRouter;
