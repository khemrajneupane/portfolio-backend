const express = require("express");
const portfolioRouter = express.Router();
const config = require("../utils/config");
const jwt = require("jsonwebtoken");
const tokenExtractor = require("../utils/middleware");
const Portfolio = require("../models/portfolio");
const User = require("../models/user");
const MobileDetect = require("mobile-detect"); //to get user-agent
const platform = require("platform"); //to parse user-agent
const os = require("os"); //operating system

/** GET all answers: http://localhost:3001/api/portfolio */
portfolioRouter.get("/", async (req, res) => {
  const md = new MobileDetect(req.headers["user-agent"]);
  const agentValue = md.ua;

  const info = platform.parse(agentValue);
  const infos = {
    OStype: os.type(),
    description: info.description,
    browserName: info.name,
    operatingSystem: info.os.family
  };

  const portfolios = await Portfolio.find({}).sort({ submissionTimestamp: -1 });
  res.json(portfolios.map(p => p.toJSON()));
});

/**POST http://localhost:3001/api/portfolios/ */
portfolioRouter.post("/", async (req, res, next) => {
  const body = req.body;
  //console.log(user);
  if (!body.technology || !body.type || !body.info) {
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
    const portfolio = new Portfolio({
      content: body.content,
      technology: body.technology,
      type: body.type,
      info: body.info,
      votes: body.votes,
      user: user._id
    });
    if (!portfolio.votes) {
      portfolio.votes = 0;
    }
    const savedPortfolios = await portfolio.save();
    user.portfolios = user.portfolios.concat(savedPortfolios._id);
    await user.save();
    res.status(201).json(savedPortfolios.toJSON());
  } catch (e) {
    if (e.name === "CastError") {
      //console.log(e);
      res.status(400).send(`Value for ${e.stringValue} is not correct`);
    } else {
      next(e);
    }
  }
});

/**DELETE http://localhost:3003/api/portfolios/id*/

portfolioRouter.delete("/:id", async (req, res, next) => {
  try {
    const decodedToken = await jwt.verify(
      tokenExtractor.tokenExtractor(req),
      config.SECRET
    );

    if (!tokenExtractor.tokenExtractor(req) || !decodedToken.id) {
      res.status(400).send({ error: "Incorrect username or password" });
      return;
    }
    const delThisPortfolio = await Portfolio.findById(req.params.id);

    //console.dir(delThisBlog);
    if (delThisPortfolio.user.toString() === decodedToken.id.toString()) {
      await Portfolio.findByIdAndRemove(req.params.id);
      res.status(200).end();
    } else {
      res.status(400).end();
    }
  } catch (e) {
    if (e.name === "CastError") {
      console.log(e);
      res.status(400).send(`Id: ${e.stringValue} does not exist`);
    } else {
      next(e);
    }
  }
});

module.exports = portfolioRouter;
