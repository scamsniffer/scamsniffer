const express = require('express')
const compression = require('compression')
const cors = require('cors')
const { ModelHandler } = require('sequelize-handlers')
const bodyParser = require('body-parser')
const app = express()

const { ScamList, DomainSummary, TwitterSummary } = require("./schema");
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
};

app.get("/ScamList", Handlers.ScamList.query());
app.get("/DomainSummary", Handlers.DomainSummary.query());
app.get("/TwitterSummary", Handlers.TwitterSummary.query());
app.post("/report", reportScam);

app.get("*", async (req, res) => {
  res.send("Hello")
})

module.exports = {
  app
}
