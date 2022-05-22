const { DomainSummary, ScamList } = require("../schema");
const { reportScam } = require("../reporter");
const { increaseCount } = require('../utils/summary');

async function getAndReport() {
  const needReportDomains = await DomainSummary.findAll({
    limit: 10,
    where: {
      needReport: 1,
      reported: 0,
    },
  });

  let reported = 0
  for (let index = 0; index < needReportDomains.length; index++) {
    const needReportDomain = needReportDomains[index];
    const domainUrls = await ScamList.findAll({
      raw: true,
      limit: 5,
      where: {
        host: needReportDomain.host,
      },
    });
    if (domainUrls.length) {
      const reportUrl = domainUrls[0].link;
      await reportScam(reportUrl);
      reported++
    }
  }

  if (reported) await increaseCount("reported", reported);
  console.log("found", needReportDomains.length);
  setTimeout(getAndReport, 10 * 1000);
}

getAndReport();
