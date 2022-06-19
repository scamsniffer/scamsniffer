const { Detector } = require("@scamsniffer/detector");
const detector = new Detector({
  onlyBuiltIn: false,
});

async function detectByUrl(req, res) {
  try {
    let result = await detector?.detectScam({
      links: [req.query.link],
    });
    res.json({
      data: result,
    });
  } catch (e) {
    console.log("failed", e);
    res.json({
      error: e.toString(),
    });
  }
}

module.exports = {
  detectByUrl,
};
