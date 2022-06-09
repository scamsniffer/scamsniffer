const { lookup } = require("./whois");
const parseRawData = require("./whois/parsed");

async function lookupDomain(req, res) {
    let data = null
  try {
    const domain = req.query.domain;
    data = await new Promise((resolve, reject) => {
      lookup(domain, { timeout: 10 * 1000 }, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
    const parsed = parseRawData(data, domain);
    res.json({
      data: parsed,
    });
  } catch (e) {
    console.log("failed", e);
    res.json({
        raw: data,
      error: e.toString(),
    });
  }
}

module.exports = {
  lookupDomain,
};