const { ScamActivity } = require("./schema");
const { Op } = require('sequelize')
// init();

ScamActivity.destroy({
  where: {
    id: {
      [Op.in]: [743],
    },
  },
});