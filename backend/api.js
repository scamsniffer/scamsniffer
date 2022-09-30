require("dotenv").config();

const express = require("express");
const compression = require("compression");
const cors = require("cors");
const { ModelHandler } = require("sequelize-handlers");
const bodyParser = require("body-parser");
const app = express();

const {
  ScamList,
  Summary,
  DomainSummary,
  TwitterSummary,
  DetectHistory,
  ScamActivity
} = require("./schema");
const { reportScam, getStatus } = require("./handlers/report");
const { adScamActivity, recallActivity } = require("./handlers/activity");
const { detectUrl } = require("./handlers/page");
const { lookupDomain } = require("./handlers/domain");
const { detectByUrl } = require("./handlers/detector");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

app.use(cors());
app.use(compression());
app.use(
  bodyParser.json({
    limit: "10mb",
  })
);
app.use(morgan("combined", { stream: accessLogStream }));

const Handlers = {
  ScamList: new ModelHandler(ScamList),
  DomainSummary: new ModelHandler(DomainSummary),
  TwitterSummary: new ModelHandler(TwitterSummary),
  Summary: new ModelHandler(Summary),
  DetectHistory: new ModelHandler(DetectHistory),
  ScamActivity: new ModelHandler(ScamActivity),
};

app.get("/scamList", Handlers.ScamList.query());
app.get("/domainSummary", Handlers.DomainSummary.query());
app.get("/twitterSummary", Handlers.TwitterSummary.query());
app.get("/summary", Handlers.Summary.query());
app.get("/detectHistory", Handlers.DetectHistory.query());
app.get("/scamActivity", Handlers.ScamActivity.query());

app.get("/getStatus", getStatus);
app.all("/detect", detectUrl);
app.get("/whois/lookup", lookupDomain);
app.post("/report", reportScam);
app.get("/detector/detectByUrl", detectByUrl);

app.all("/scam/activity", adScamActivity);
app.all("/scam/activity/recall", recallActivity);


app.get("*", async (req, res) => {
  res.send("Hello");
});

module.exports = {
  app,
};
