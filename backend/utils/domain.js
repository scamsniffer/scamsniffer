const { parseDomain, ParseResultType } = require( "parse-domain");
const urlParser = require('url')

function getTopDomain(url) {
  let topDomain = null;
  const host = urlParser.parse(url).host;
  const parseResult = parseDomain(host);
  switch (parseResult.type) {
    case ParseResultType.Listed: {
      const { hostname, domain, topLevelDomains } = parseResult;
      topDomain = [domain].concat(topLevelDomains).join(".");
      // console.log(`${hostname} belongs to ${topLevelDomains.join(".")}`);
      break;
    }
    case ParseResultType.Reserved:
    case ParseResultType.NotListed: {
      const { hostname } = parseResult;
      // console.log(`${hostname} is a reserved or unknown domain`);
      break;
    }
    default:
      throw new Error(`${host} is an ip address or invalid domain`);
  }
  return {
    topDomain,
    host,
  };
}

module.exports = {
  getTopDomain,
};