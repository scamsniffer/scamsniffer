const { ScamActivity, DetectHistory } = require("../schema");

(async () => {

    await ScamActivity.destroy({
        where: {

        }
    })
    
  const histories = await DetectHistory.findAll({
    attributes: ["id", "createdAt", "link", "linkAddress", "host", "actions"],
  });

  for (let index = 0; index < histories.length; index++) {
    const history = histories[index];
    if (!history.actions) {
      continue;
    }
    const row = {
      link: history.link,
      host: history.host,
      address: history.linkAddress,
      action: history.actions,
      time: history.createdAt,
      relatedHost: null,
    };
    // console.log(row);
    try {
        await ScamActivity.create(row);
    } catch(e) {
        console.log(e)
    }
  }
})();
