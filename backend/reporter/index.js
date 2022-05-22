const allProviders = [
  require("./google"),
  // require("./metamask.js")
];

async function reportScam(url, domain) {
  try {
    await Promise.all(
      allProviders.map((_) => {
        return _.reportScam(url);
      })
    );
    console.log(`${url} reported`);
  } catch (e) {
    console.log(`${url} report failed`, e);
  }
}

module.exports = {
  reportScam,
};
