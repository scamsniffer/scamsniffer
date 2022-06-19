const rankCollections = require("./collections.json");

async function gen() {
    temp2.concat(temp3, temp4).map((_, index) => {
        const stats = _.node.statsV2;
        return {
            rank: index + 1,
          ..._.node,
          floorPrice: stats.floorPrice && parseFloat(stats.floorPrice.unit),
          totalVolume:  stats.totalVolume && parseFloat(stats.totalVolume.unit)
        };
    })
}


module.exports = {
  rankCollections,
};