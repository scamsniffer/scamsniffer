const { ScamList, Cache, DomainSummary } = require("../schema");
const { Op } = require("sequelize");
const axios = require("axios");
require("dotenv").config();

const API = process.env.DETECTOR_API;
const api_key = process.env.DETECTOR_API_KEY;

async function detectDomain(link, scam = null) {
  const { data } = await axios.get(API, {
    params: {
      api_key,
      link,
      desc: scam
        ? `${scam.project}\nOfficial site:${scam.projectUrl}\nTwitter:${scam.projectTwitter}\nvia:Plugin Similar Scanner`
        : `auto scan`,
    },
  });
//   console.log("detectDomain", data, link);
}

async function doSync(recentDomain) {
  try {
    const recentScams = await ScamList.findAll({
      limit: 1,
      where: {
        host: recentDomain.host,
      },
    });

    console.log("detect", recentDomain.host);
    if (recentScams.length) {
      await detectDomain(recentScams[0].link, recentScams[0]);
    } else {
      await detectDomain(`https://${recentDomain.host}`, null);
    }
  } catch (e) {
    console.log("error", e);
  }
}

async function syncData() {
  let lastId = 0;
  const cache = await Cache.findOne({
    where: {
      key: "sync_id",
    },
  });

  if (cache) {
    lastId = parseInt(cache.value);
  }

  console.log("lastId", lastId);

  const newRows = await DomainSummary.findAll({
    where: {
      id: {
        [Op.gt]: lastId,
      },
      needReport: 1,
    },
  });

  console.log("found", newRows.length);
  for (let index = 0; index < newRows.length; index++) {
    const newRow = newRows[index];
    await doSync(newRow);
    await new Promise((resolve) => {
        setTimeout(resolve, 500);
    });
    lastId = newRow.id;
  }

  if (cache) {
    cache.value = lastId;
    await cache.save();
    console.log("save");
  } else {
    console.log("create");
    await Cache.create({
      key: "sync_detect_id",
      value: lastId,
    });
  }
}

async function syncTask() {
  for (let index = 0; index < Infinity; index++) {
    try {
      await syncData();
    } catch (e) {}
    await new Promise((resolve) => {
      setTimeout(resolve, 660 * 1000);
    });
  }
}

syncTask();
