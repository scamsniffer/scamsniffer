const express = require('express')
const compression = require('compression')
const cors = require('cors')
const { ModelHandler } = require('sequelize-handlers')
const bodyParser = require('body-parser')
const app = express()

const { ScamList, Summary, DomainSummary, TwitterSummary } = require("./schema");
const reportScam = require("./handlers/report");

app.use(cors())
app.use(compression())
app.use(
  bodyParser.json({
    limit: '10mb'
  })
);

const Handlers = {
  ScamList: new ModelHandler(ScamList),
  DomainSummary: new ModelHandler(DomainSummary),
  TwitterSummary: new ModelHandler(TwitterSummary),
  Summary: new ModelHandler(Summary),
};

app.get("/scamList", Handlers.ScamList.query());
app.get("/domainSummary", Handlers.DomainSummary.query());
app.get("/twitterSummary", Handlers.TwitterSummary.query());
app.get("/summary", Handlers.Summary.query());
app.post("/report", reportScam);

app.get("*", async (req, res) => {
  res.send("Hello")
})

module.exports = {
  app
}
