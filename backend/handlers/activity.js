const { DomainSummary, DetectHistory, ScamActivity } = require("../schema");
const { getTopDomain } = require("../utils/domain");
const { increaseCount } = require("../utils/summary");
const axios = require("axios");

// const detectTimeout = 60 * 1000 * 60 * 6;
// const DetectorVersion = "0.0.3";

async function adScamActivity(req, res) {
  const item = req.body;
//   console.log(req.query);
  if (item) {
    if (item.token != process.env.AUTH_TOKEN) {
      return res.json({
        error: "auth failed",
      });
    }
  }

  const parsed = getTopDomain(item.activity.link);
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

  try {
    await ScamActivity.create(item.activity);
    res.json({
      msg: "reported",
    });
  } catch(e) {
    res.json({
      error: e.toString(),
    });
  }

//   const parsed = getTopDomain(link);
//   try {
//     const domainStat = await DomainSummary.findOne({
//       where: {
//         host: parsed.host,
//       },
//     });
//     const needRefresh = forceDetect
//       ? true
//       : domainStat
//       ? Date.now() - domainStat.lastDetect > detectTimeout ||
//         domainStat.lastDetectVer !== DetectorVersion
//       : true;
//     await increaseCount("total");
//     console.log("needRefresh", needRefresh);
//     if (!needRefresh) {
//       return res.json({
//         isBlack: domainStat.isBlack,
//       });
//     }
//     const { data } = item.data
//       ? item
//       : await axios.get(process.env.DETECTOR_ENDPOINT, {
//           params: {
//             link: link,
//           },
//         });

//     const detectResult = {
//       isBlack:
//         domainStat && !forceDetect
//           ? domainStat.isBlack
//           : data.error
//           ? 0
//           : data.uniqueActions.length > 0
//           ? 1
//           : 0,
//       lastDetect: Date.now(),
//       lastDetectVer: DetectorVersion,
//     };

//     await DetectHistory.create({
//       link,
//       host: parsed.host,
//       detail: JSON.stringify(data),
//       linkAddress: data.error ? null : data.hackerAddress.join(","),
//       actions: data.error ? null : data.uniqueActions.join(","),
//     });

//     if (domainStat) {
//       domainStat.count = domainStat.count + 1;
//       await domainStat.update(
//         Object.assign(
//           {
//             count: domainStat.count + 1,
//           },
//           detectResult
//         )
//       );
//     } else {
//       await DomainSummary.create(
//         Object.assign(
//           {
//             host: parsed.host,
//             topDomain: parsed.topDomain,
//             count: 1,
//           },
//           detectResult
//         )
//       );
//     }
//     res.json({
//       isBlack: detectResult.isBlack,
//     });
//   } catch (e) {
//     console.error("error", e);
//     res.json({
//       error: e.toString(),
//     });
//   }
}


async function recallActivity(req, res) {
  const item = req.body;
  if (item) {
    if (item.token != process.env.AUTH_TOKEN) {
      return res.json({
        error: "auth failed",
      });
    }
  }
  await ScamActivity.destroy({
    where: {
      host: {
        [Op.in]: item.host,
      },
    },
  });

  res.json({
    done: true
  })
}

module.exports = {
  adScamActivity,
  recallActivity,
};
