const { DomainSummary } = require("./schema");
const { Op } = require('sequelize')
// init();

DomainSummary.destroy({
  where: {
    topDomain: {
      [Op.in]: ["premint.xyz", 'synthetix.io', "fractal.is", "nexustracker.io", 'nftgo.io', 'twitter.com'],
    },
  },
});