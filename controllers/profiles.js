const express = require("express");
const profilesRouter = express.Router();
const config = require("../utils/config");
const jwt = require("jsonwebtoken");
const Profile = require("../models/profile");
const User = require("../models/user");
const tokenExtractor = require("../utils/middleware");

/**get http://localhost:3003/api/blogs*/
profilesRouter.get("/", async (request, response) => {
  const blogs = await Profile.find({});
  response.json(blogs.map(blog => blog.toJSON()));
});

/**POST http://localhost:3003/api/blogs/id */
profilesRouter.post("/", async (req, res, next) => {
  const body = req.body;
  //console.log(user);
  if (!body.title || !body.author || !body.url) {
    res.status(400).send("title, author, url fields are all required");
  } else if (body.likes && isNaN(Number(body.likes))) {
    res.send(`${body.likes} is not a number. Please supply a valid number`);
  }
  try {
    const decodedToken = await jwt.verify(
      tokenExtractor.tokenExtractor(req),
      config.SECRET
    );

    if (!tokenExtractor.tokenExtractor(req) || !decodedToken.id) {
      res.status(400).send({ error: "Incorrect username or password" });
      return;
    }
    const user = await User.findById(decodedToken.id);
    const blog = new Profile({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    });
    if (!blog.likes) {
      blog.likes = 0;
    }
    const savedBlogs = await blog.save();
    user.blogs = user.blogs.concat(savedBlogs._id);
    await user.save();
    res.status(201).json(savedBlogs.toJSON());
  } catch (e) {
    if (e.name === "CastError") {
      //console.log(e);
      res.status(400).send(`Value for ${e.stringValue} is not correct`);
    } else {
      next(e);
    }
  }
});

module.exports = profilesRouter;
