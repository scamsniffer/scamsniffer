async function loadCollections() {
    const req = await fetch(
      "https://api-mainnet.magiceden.io/popular_collections?more=true&timeRange=7d&edge_cache=true",
      {
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "omit",
      }
    );
    return (await req.json()).collections;
}


(async () => {
    const collections = await loadCollections();
    const parsedCollections = collections.map(_ => {
        return {
          name: _.name,
          slug: _.symbol,
          externalUrl: _.website,
          twitterUsername: _.twitter && _.twitter.split("/").pop(),
        };
    })
    console.log("parsedCollections", parsedCollections);
})();