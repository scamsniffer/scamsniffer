const { ScamList, DomainSummary, TwitterSummary, Summary } = require("../schema");
const { getTopDomain } = require("../utils/domain");
const { increaseCount } = require('../utils/summary')



async function reportScam(req, res) {
  console.log(req.body);
  const item = req.body;
  const { post } = item;
  const link = post.links[0];
  const parsed = getTopDomain(link);
  const row = {
    topDomain: parsed.topDomain,
    host: parsed.host,
    link: link,
    tweet: post.id,
    type: "tweet",
    twitter: post.userId,
    time: Date.now(),
    nickname: post.nickname,
    content: post.content,
    project: item.name,
    projectTwitter: item.twitterUsername,
    projectUrl: item.externalUrl,
  };
  console.log(row);
  await ScamList.create(row);

  const domainStat = await DomainSummary.findOne({
    where: {
      host: parsed.host,
    },
  });
  if (domainStat) {
    domainStat.count = domainStat.count + 1;
    await domainStat.save();
  } else {
    await DomainSummary.create({
      host: parsed.host,
      topDomain: parsed.topDomain,
      count: 1,
    });
  }

  const twitterStat = await TwitterSummary.findOne({
    where: {
      twitter: row.twitter,
    },
  });
  if (twitterStat) {
    twitterStat.count = domainStat.count + 1;
    await twitterStat.save();
  } else {
    await TwitterSummary.create({
      twitter: row.twitter,
      count: 1,
    });
  }

  await increaseCount("total");

  res.json({
    msg: "reported",
  });
}

module.exports = reportScam;
