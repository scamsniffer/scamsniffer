const axios = require("axios");
const { DomainSummary } = require("../schema");
const API = `https://api.scamsniffer.io/detect`;
const { Op } = require('sequelize')
const dayLimit = 20;

async function checkAndUpdate(item) {
  try {
    const { data: result } = await axios.get(
      `https://whois.scamsniffer.io/?${item.topDomain}`
    );
    const { data, error } = result;
    if (error) {
      item.needReport = 6;
    }
    if (data && !error) {
      const creationDaysOfDomain = Math.floor(
        (Date.now() - new Date(data.creationDate).getTime()) / 1000 / 86400
      );

      item.creationDate = data.creationDate;
      item.expirationDate = data.expirationDate;
      item.registrar = data.registrar;
      item.lastUpdatedDate = data.updatedDate;

      if (creationDaysOfDomain < dayLimit) {
        item.needReport = 1;
      } else {
        item.needReport = 2;
      }
    }
  } catch (e) {
    console.log("error", e);
    item.needReport = 5;
  }
  await item.save();
}

async function detectRecentDomain() {
  const recentDomains = await DomainSummary.findAll({
    limit: 12,
    where: {
      needReport: {
        [Op.in]: [0, 6]
      },
    },
    order: [["id", "desc"]],
  });

  for (let index = 0; index < recentDomains.length; index++) {
    const recentDomain = recentDomains[index];
    try {
      await checkAndUpdate(recentDomain);
      console.log("recentDomain", recentDomain);
    } catch (e) {
      console.log("error", e);
    }
  }

  setTimeout(detectRecentDomain, 1000 * 60);
}

detectRecentDomain();
