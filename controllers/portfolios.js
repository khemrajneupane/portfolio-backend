const express = require("express");
const portfolioRouter = express.Router();
const config = require('../utils/config')

const Portfolio = require("../models/portfolio");
const MobileDetect = require('mobile-detect');//to get user-agent
const platform = require('platform');//to parse user-agent
const os = require('os')//operating system

/** GET all answers: http://localhost:3001/api/portfolio */
portfolioRouter.get("/", async (req, res) => {
  const md = new MobileDetect(req.headers['user-agent']);
  const agentValue = md.ua;
  console.log(agentValue);
  const info = platform.parse(agentValue);
  const infos = { OStype: os.type(), description: info.description, browserName: info.name, operatingSystem: info.os.family };

  console.log(os.type())
  const portfolios = await Portfolio.find({}).sort({ submissionTimestamp: -1 });
  res.json(portfolios.map(p => p.toJSON()).concat(infos));

});
module.exports = portfolioRouter;

/**  content,
  technology,
  type,
  info,
  rating */