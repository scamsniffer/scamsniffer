const tokens = require("./dune/stolen_tokens.json");
const allCollections = require("./raw.json");
const fs = require("fs");

const allTokens = tokens.map((_) => {
  const collection = allCollections.find((c) => {
    const contract =
      c.detail.assetContracts.edges &&
      c.detail.assetContracts.edges[0] &&
      c.detail.assetContracts.edges[0].node;
    return contract && contract.address === _.contract_address;
  });
  // console.log(collection.detail);
  if (collection) {
    const { detail } = collection;
    const contract =
      detail.assetContracts.edges &&
      detail.assetContracts.edges[0] &&
      detail.assetContracts.edges[0].node;
    // return contract && contract.address === _.contract_address;
    _.collection = {
      slug: collection.collection.slug,
      name: detail.name,
      description: detail.description,
      imageUrl: detail.imageUrl,
      connectedTwitterUsername: detail.connectedTwitterUsername,
      assetContracts: detail.assetContracts,
      externalUrl: _.externalUrl,
      twitterUsername: _.twitterUsername,
      contract_address: contract.address,
      mediumUsername: _.mediumUsername,
      bannerImageUrl: _.bannerImageUrl,
    };
  }
  return _;
});

const sumBySlug = allTokens.reduce((all, item) => {
  all[item.collection.slug] = all[item.collection.slug] || [];
  all[item.collection.slug].push(item);
  return all;
}, {});

const topCollections = Object.keys(sumBySlug)
  .map((slug) => {
    const collection = allTokens.find((_) => _.collection.slug === slug);
    return {
      total: sumBySlug[slug].length,
      ...collection.collection,
    };
  })
  .sort((a, b) => b.total - a.total)
  .slice(0, 100);

fs.writeFileSync(
  "./data/summary.json",
  JSON.stringify(topCollections.slice(0, 100))
);

Object.keys(sumBySlug)
  .map((slug) => {
    const collection = allTokens.find((_) => _.collection.slug === slug);

    fs.writeFileSync(
      `./data/collections/${collection.collection.contract_address}.json`,
      JSON.stringify({
        collection: collection.collection,
        tokens: sumBySlug[slug].map((_) => ({
          tokenId: _.tokenId,
          firstTime: _.first_time,
        })),
      })
    );
  })
  .sort((a, b) => b.total - a.total);

// console.log(topCollections.slice(0, 100));
