const axios = require("axios");
// const { DomainSummary, ScamList } = require("../schema");
const API = `https://api.scamsniffer.io/detect`;
require("dotenv").config();

async function detectDomain(link) {
  console.log("process.env.DETECTOR_ENDPOINT", process.env.DETECTOR_ENDPOINT, link);
  const { data: pageData } = await axios.get("http://localhost:8080/detect", {
    params: {
      link: link,
    },
  });

  console.log("pageData", link, pageData.hackerAddress);
  const { data } = await axios.post(
    API + "?forceDetect=1&link=" + encodeURIComponent(link),
    {
      token: process.env.AUTH_TOKEN,
      data: pageData,
    }
  );
  console.log("detectDomain", data, link);
}

async function detectRecentDomain() {
  const { data: recentDomains } = await axios.get(
    "https://api.scamsniffer.io/DomainSummary?sort=-id&needReport=1"
  );

  for (let index = 0; index < recentDomains.length; index++) {
    const recentDomain = recentDomains[index];
    try {
      const { data: lastDates } = await axios.get(
        "https://api.scamsniffer.io/detectHistory?host=" +
          recentDomain.host +
          "&fields=createdAt&sort=-id"
      );

      const lastDate = lastDates.length ? lastDates[0].createdAt : null;
      if (lastDate) {
        const timeLeft = new Date(lastDate).getTime() - Date.now();
        if (timeLeft < 60 * 1000 * 60) {
          console.log('too short')
          // continue;
        }
      }


        // const recentScams = await ScamList.findAll({
        //   limit: 1,
        //   where: {
        //     host: recentDomain.host,
        //   },
        // });
        // if (recentScams.length) {
        //   console.log("detect", recentDomain.host);
        //   await detectDomain(recentScams[0].link);
        // } else {
        await detectDomain(`https://${recentDomain.host}`);
      // }
    } catch (e) {
      console.log("error", e);
    }
  }

  setTimeout(detectRecentDomain, 1000 * 60 * 30);
}

detectRecentDomain();
