const express = require("express");
const messageRouter = express.Router();
const Message = require("../models/message");

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

module.exports = messageRouter;
