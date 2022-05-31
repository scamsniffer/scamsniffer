const { DomainSummary, DetectHistory } = require("../schema");
const { getTopDomain } = require("../utils/domain");
const { increaseCount } = require("../utils/summary");
const axios = require("axios");

async function detectUrl(req, res) {
  const link = req.query.link;
  const forceDetect = req.query.forceDetect;
  const parsed = getTopDomain(link);
  try {
    const domainStat = await DomainSummary.findOne({
      where: {
        host: parsed.host,
      },
    });

    const needRefresh = forceDetect
      ? true
      : domainStat
      ? Date.now() - domainStat.lastDetect > 60 * 1000 * 60 * 3
      : true;

    await increaseCount("total");

    if (!needRefresh) {
      return {
        isBlack: domainStat.isBlack,
      };
    }

    const { data } = await axios.get(process.env.DETECTOR_ENDPOINT, {
      params: {
        link: link,
      },
    });

    const detectResult = {
      isBlack: data.uniqueActions.length > 0,
      lastDetect: Date.now(),
    };

    await DetectHistory.create({
      link,
      host: parsed.host,
      detail: JSON.stringify(data),
    });

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
      isBlack: detectResult.isBlack,
    });
  } catch (e) {
    res.json({
        error: e.toString()
    }); 
  }
}
module.exports = {
  detectUrl,
};
