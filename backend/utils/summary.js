
const { Summary } = require('../schema')

async function increaseCount(key = "total_report", count = 1) {
  const totalReport = await Summary.findOne({
    where: {
      key,
    },
  });

  if (totalReport) {
    totalReport.counts = totalReport.counts + count;
    await totalReport.save();
  } else {
    await Summary.create({
      key,
      counts: 1,
    });
  }
}

module.exports = {
  increaseCount,
};