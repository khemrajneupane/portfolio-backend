const express = require("express");
const experienceRouter = express.Router();
const config = require("../utils/config");
const jwt = require("jsonwebtoken");
const tokenExtractor = require("../utils/middleware");
const Experience = require("../models/experience");
const User = require("../models/user");
const MobileDetect = require("mobile-detect"); //to get user-agent
const platform = require("platform"); //to parse user-agent
const os = require("os"); //operating system

/** GET all answers: http://localhost:3001/api/experiences */
experienceRouter.get("/", async (req, res) => {
  const md = new MobileDetect(req.headers["user-agent"]);
  const agentValue = md.ua;
  console.log(agentValue);
  const info = platform.parse(agentValue);
  const infos = {
    OStype: os.type(),
    description: info.description,
    browserName: info.name,
    operatingSystem: info.os.family
  };

  console.log(os.type());
  const experiences = await Experience.find({}).sort({
    submissionTimestamp: -1
  });
  res.json(experiences.map(p => p.toJSON()));
});

/**POST http://localhost:3001/api/experiences/ */

experienceRouter.post("/", async (req, res, next) => {
  const body = req.body;
  //console.log(user);
  if (!body.job_title || !body.company || !body.start_date) {
    res.status(400).send("fields are all required");
  } else if (body.votes && isNaN(Number(body.votes))) {
    res.send(`${body.votes} is not a number. Please like it with number`);
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
    const experience = new Experience({
      job_title: body.job_title,
      company: body.company,
      start_date: body.start_date,
      end_date: body.end_date,
      responsibilities: body.responsibilities,
      votes: body.votes,
      user: user._id
    });
    if (!experience.votes) {
      experience.votes = 0;
    }
    const savedExperiences = await experience.save();
    user.experiences = user.experiences.concat(savedExperiences._id);
    await user.save();
    res.status(201).json(savedExperiences.toJSON());
  } catch (e) {
    if (e.name === "CastError") {
      //console.log(e);
      res.status(400).send(`Value for ${e.stringValue} is not correct`);
    } else {
      next(e);
    }
  }
});

module.exports = experienceRouter;
