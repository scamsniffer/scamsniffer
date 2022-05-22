const { DomainSummary, ScamList } = require("../schema");
const { reportScam } = require("../reporter");

async function getAndReport() {
  const needReportDomains = await DomainSummary.findAll({
    limit: 10,
    where: {
      needReport: 1,
      reported: 0,
    },
  });

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
    }
  }

  console.log("found", needReportDomains.length);
  setTimeout(getAndReport, 10 * 1000);
}

getAndReport();
