const axios = require("axios");
const { DomainSummary, ScamList } = require("../schema");
require("dotenv").config();

const API =  process.env.DETECTOR_API;
const api_key = process.env.DETECTOR_API_KEY;

async function detectDomain(link, scam = null) {
  const { data } = await axios.get(API, {
    params: {
      api_key,
      link,
      desc: scam
        ? `${scam.project}\nOfficial site:${scam.projectUrl}\nTwitter:${scam.projectTwitter}`
        : `auto scan`,
    },
  });
  console.log("detectDomain", data, link);
}

async function detectRecentDomain() {
  const recentDomains = await DomainSummary.findAll({
    limit: 15,
    needReport: 1,
    order: [
        ['id', 'desc']
    ],
  });

  for (let index = 0; index < recentDomains.length; index++) {
    const recentDomain = recentDomains[index];
    try {
      const recentScams = await ScamList.findAll({
        limit: 1,
        where: {
          host: recentDomain.host,
        },
      });
      if (recentScams.length) {
        console.log("detect", recentDomain.host);
        await detectDomain(recentScams[0].link, recentScams[0]);
      } else {
        await detectDomain(`https://${recentDomain.host}`, null);
      }
    } catch (e) {
      console.log("error", e);
    }
  }

  setTimeout(detectRecentDomain, 1000 * 60 * 10);
}

detectRecentDomain();
