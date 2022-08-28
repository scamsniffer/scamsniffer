const { ScamList, DomainSummary, TwitterSummary, Summary } = require("../schema");
const { getTopDomain } = require("../utils/domain");
const { increaseCount } = require('../utils/summary')

async function reportScam(req, res) {
  console.log('reportScam', req);
  // await ScamList.sync({ alter: true });
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
    matchType: item.matchType,
    projectTwitter: item.twitterUsername,
    projectUrl: item.externalUrl,
  };
  console.log('', row);
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

  if (row.twitter) {
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
  }

  await increaseCount("total");

  res.json({
    msg: "reported",
  });
}


async function getStatus(req, res) {
  const [allSummary, recentDetected, recentReported, recentScams, recentScamActivity] =
    await Promise.all([
      Summary.findAll({
        raw: true,
      }),
      DomainSummary.findAll({
        limit: 20,
        order: [["id", "desc"]],
      }),
      DomainSummary.findAll({
        limit: 20,
        where: {
          reported: 1,
        },
        order: [["id", "desc"]],
      }),
      ScamList.findAll({
        limit: 20,
        attributes: [
          "id",
          "link",
          "topDomain",
          "twitter",
          "nickname",
          "createdAt",
          "projectUrl",
          "projectTwitter",
          "project",
        ],
        where: {},
        order: [["id", "desc"]],
      }),
      ScamActivity.findAll({
        limit: 10,
        attributes: [
          "id",
          "link",
          "host",
          "action",
          "time"
        ],
        order: [["id", "desc"]],
      }),
    ]);

  res.json({
    summary: allSummary.reduce((all, item) => {
      all[item.key] = item.counts;
      return all;
    }, {}),
    recentDetected,
    recentReported,
    recentScams,
    recentScamActivity
  });
}

module.exports = {
  reportScam,
  getStatus
};
