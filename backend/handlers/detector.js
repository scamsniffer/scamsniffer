const { Detector } = require("@scamsniffer/detector");
const { increaseCount } = require("../utils/summary");
const { DomainSummary, DetectHistory, ScamList } = require("../schema");
const { getTopDomain } = require("../utils/domain");

const detector = new Detector({
  onlyBuiltIn: false,
});

async function detectByUrl(req, res) {
  const link = req.query.link;
  const parsed = getTopDomain(link);
  try {
    const domainStat = await DomainSummary.findOne({
      where: {
        host: parsed.host,
      },
    });
    //  const needRefresh = forceDetect
    //    ? true
    //    : domainStat
    //    ? Date.now() - domainStat.lastDetect > detectTimeout ||
    //      domainStat.lastDetectVer !== DetectorVersion
    //    : true;
    await increaseCount("total");
    //  console.log("needRefresh", needRefresh);
    //  if (!needRefresh) {
    //    return res.json({
    //      isBlack: domainStat.isBlack,
    //    });
    //  }

    let result = await detector?.detectScam({
      links: [req.query.link],
    });
    const detectResult = {
      isBlack: result ? 1 : 0,
      lastDetect: Date.now(),
      lastDetectVer: "0.0.9",
    };

    if (result) {
      const row = {
        topDomain: parsed.topDomain,
        host: parsed.host,
        link: link,
        tweet: null,
        type: "link",
        twitter: null,
        time: Date.now(),
        nickname: null,
        content: null,
        project: result.name,
        matchType: result.matchType,
        projectTwitter: result.twitterUsername,
        projectUrl: result.externalUrl,
      };
      //  console.log(row);
      await ScamList.create(row);
    }

    if (domainStat) {
      domainStat.count = domainStat.count + 1;
      await domainStat.update(
        Object.assign(
          {
            count: domainStat.count + 1,
          },
          detectResult
        )
      );
    } else {
      await DomainSummary.create(
        Object.assign(
          {
            host: parsed.host,
            topDomain: parsed.topDomain,
            count: 1,
          },
          detectResult
        )
      );
    }
    res.json({
      data: result,
    });
  } catch (e) {
    console.error("error", e);
    res.json({
      error: e.toString(),
    });
  }

  // try {
  //   let result = await detector?.detectScam({
  //     links: [req.query.link],
  //   });
  //   res.json({
  //     data: result,
  //   });
  // } catch (e) {
  //   console.log("failed", e);
  //   res.json({
  //     error: e.toString(),
  //   });
  // }
}

module.exports = {
  detectByUrl,
};
