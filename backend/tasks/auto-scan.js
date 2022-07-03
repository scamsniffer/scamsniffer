const axios = require("axios");
const { DomainSummary, ScamList } = require("../schema");
const API = `https://api.scamsniffer.io/detect`;

async function detectDomain(link) {
  const { data } = await axios.get(API, {
    params: {
      link,
    },
  });
  console.log("detectDomain", data, link);
}

async function detectRecentDomain() {
  const recentDomains = await DomainSummary.findAll({
    limit: 50,
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
        await detectDomain(recentScams[0].link);
      } else {
        await detectDomain(`https://${recentDomain.host}`);
      }
    } catch (e) {
      console.log("error", e);
    }
  }

  setTimeout(detectRecentDomain, 1000 * 60 * 30);
}

detectRecentDomain();
